import React from "react";
import { View, StyleSheet, Platform, KeyboardAvoidingView } from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
require("firebase/firestore");

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      uid: "",
      user: {
        _id: "",
        avatar: "",
        name: "",
      },
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
      });
    });
    this.setState({
      messages,
    });
  };

  componentDidMount() {
    // Show Username in Chat title
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    //Firebase DB query messages
    this.referenceChatMessages = firebase.firestore().collection("messages");
    this.unsubscribe = this.referenceChatMessages.onSnapshot(
      this.onCollectionUpdate
    );

    //Authenticate users
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      this.setState({
        uid: user.uid,
        messages: [],
        user: {
          _id: user.uid,
          name: name,
        },
      });
      this.unsubscribe = this.referenceChatMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.authUnsubscribe();
  }

  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessage();
      }
    );
  }

  //Add messages to the DB
  addMessage = () => {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: message._id,
      text: message.text || "",
      createdAt: message.createdAt,
      user: message.user,
    });
  };

  //Message bubble
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#e07a5f",
          },
        }}
      />
    );
  }

  //Render chat
  render() {
    let color = this.props.route.params.color;
    let name = this.props.route.params.name;
    return (
      <View style={[styles.container, { backgroundColor: color }]}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
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
