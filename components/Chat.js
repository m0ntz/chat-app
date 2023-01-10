import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import CustomActions from "./CustomActions";
import MapView from "react-native-maps";

import firebase from "firebase";
require("firebase/firestore");

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: "",
        avatar: "",
        name: "",
      },
      loggedInText: "Please wait, you are getting logged in",
      image: null,
      location: null,
      isConnected: false,
    };

    //Firebase config
    const firebaseConfig = {
      apiKey: "AIzaSyDNLKbjrwRwtqZLYcGY1qanVLJLAzS-a_g",
      authDomain: "chat-app-46092.firebaseapp.com",
      projectId: "chat-app-46092",
      storageBucket: "chat-app-46092.appspot.com",
      messagingSenderId: "95766465979",
      appId: "1:95766465979:web:076b49c13ad6712bf4889e",
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    this.referenceChatMessages = firebase.firestore().collection("messages");
  }

  // Get Messages with async(it can only store strings, use JSON.parse to convert string to object)
  async getMessages() {
    let messages = "";
    try {
      messages = (await AsyncStorage.getItem("messages")) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  componentDidMount() {
    // Show Username in Chat title
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    // Uncomment to delete messages from asyncStorage
    // this.deleteMessages();

    //Check user's connection status
    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        this.setState({ isConnected: true });
        console.log("online");
      } else {
        console.log("offline");
        this.setState({ isConnected: false });
        // retrieve pre-stored messages in asyncStorage
        this.getMessages();
      }
    });

    //Firebase DB query messages
    this.referenceChatMessages = firebase.firestore().collection("messages");

    // this.unsubscribe = this.referenceChatMessages.onSnapshot(
    //   this.onCollectionUpdate
    // );

    //Authenticate users
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      this.setState({
        uid: user?.uid,
        messages: [],
        user: {
          _id: user.uid,
          name: name,
          avatar: "https://placeimg.com/140/140/any",
        },
        loggedInText: "",
      });
      this.unsubscribe = this.referenceChatMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    });
  }

  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessage();
        this.saveMessages();
      }
    );
  }

  //Update messages list
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar || "",
        },
        image: data.image || null,
        location: data.location || null,
      });
    });
    this.setState({
      messages,
    });
  };

  //Add messages to the DB
  addMessage = () => {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: message._id,
      text: message.text || "",
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || null,
      location: message.location || null,
    });
  };

  async saveMessages() {
    try {
      await AsyncStorage.setItem(
        "messages",
        JSON.stringify(this.state.messages)
      );
    } catch (error) {
      console.log(error.message);
    }
  }

  async deleteMessages() {
    try {
      await AsyncStorage.removeItem("messages");
      this.setState({
        messages: [],
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  componentWillUnmount() {
    if (this.isConnected) {
      this.unsubscribe();
      this.authUnsubscribe();
    }
  }

  //Message bubble
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#e07a5f",
          },
          left: {
            backgroundColor: "#fff",
          },
        }}
      />
    );
  }

  //Render message input bar only if user is online
  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return <InputToolbar {...props} />;
    }
  }

  //Render Custom Actions
  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  // Render Map view
  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  //Render chat
  render() {
    let color = this.props.route.params.color;
    let name = this.props.route.params.name;
    return (
      <View style={[styles.container, { backgroundColor: color }]}>
        <Text>{this.state.loggedInText}</Text>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          renderActions={this.renderCustomActions.bind(this)}
          renderCustomView={this.renderCustomView.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: this.state.uid,
            avatar: "https://placeimg.com/140/140/any",
            name: name,
          }}
        />
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </View>
    );
  }
}

//Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
