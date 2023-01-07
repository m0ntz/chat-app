import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
} from "react-native";

const backgroundColors = {
  black: "#090C08",
  purple: "#474056",
  grey: "#8A95A5",
  green: "#B9C6AE",
};

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: "", color: "" };
  }

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require("../assets/background-image.png")}
          style={styles.image}
        >
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={styles.title}>Chat App</Text>
            <View style={styles.startWrapper}>
              <View style={styles.inputWrapper}>
                <Image
                  style={styles.icon}
                  source={require("../assets/icon.svg")}
                />
                <TextInput
                  style={styles.input}
                  onChangeText={(name) => this.setState({ name })}
                  value={this.state.name}
                  placeholder="Enter your name"
                />
              </View>
              <View style={styles.colorWrapper}>
                <Text style={styles.colorText}>Choose Background Color:</Text>
                <View style={styles.colors}>
                  <TouchableOpacity
                    style={[
                      styles.color,
                      { backgroundColor: backgroundColors.black },
                    ]}
                    onPress={() =>
                      this.setState({ color: backgroundColors.black })
                    }
                  />
                  <TouchableOpacity
                    style={[
                      styles.color,
                      { backgroundColor: backgroundColors.purple },
                    ]}
                    onPress={() =>
                      this.setState({ color: backgroundColors.purple })
                    }
                  />
                  <TouchableOpacity
                    style={[
                      styles.color,
                      { backgroundColor: backgroundColors.grey },
                    ]}
                    onPress={() =>
                      this.setState({ color: backgroundColors.grey })
                    }
                  />
                  <TouchableOpacity
                    style={[
                      styles.color,
                      { backgroundColor: backgroundColors.green },
                    ]}
                    onPress={() =>
                      this.setState({ color: backgroundColors.green })
                    }
                  />
                </View>
              </View>
              <TouchableOpacity
                style={styles.button}
                accessible={true}
                accessibilityLabel="Enter Chat"
                accessibilityHint="Lets you enter to the chat and start a conversation"
                accessibilityRole="button"
                title="Enter Chat"
                onPress={() =>
                  this.props.navigation.navigate("Chat", {
                    name: this.state.name,
                    color: this.state.color,
                  })
                }
              >
                <Text style={styles.buttonText}>Enter Chat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    resizeMode: "cover",
    paddingVertical: "6%",
  },
  title: {
    flex: 1,
    fontSize: 45,
    fontWeight: "600",
    color: "#FFFFFF",
    paddingTop: "10%",
    paddingBottom: 0,
    marginBottom: "30%",
  },
  startWrapper: {
    flex: 2,
    backgroundColor: "white",
    height: "20%",
    width: "88%",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: "6%",
  },

  inputWrapper: {
    flexDirection: "row",
    justifyContent: "start",
    alignItems: "center",
    borderColor: "lightgrey",
    opacity: 50,
    height: 60,
    width: "88%",
    borderColor: "lightgrey",
    borderWidth: 2,
    borderRadius: 5,
    paddingLeft: 5,
  },

  icon: {
    padding: 10,
    margin: 5,
    height: 20,
    width: 20,
    resizeMode: "stretch",
    alignItems: "center",
  },

  input: {
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
    height: 60,
    borderColor: "rgba(0,0,0,0)",
    borderWidth: 2,
    borderRadius: 5,
    //elevation: 2,
    position: "absolute",
    left: -2,
    paddingLeft: 35,
    paddingRight: 20,
    width: "101%",
  },

  colorWrapper: {
    width: "88%",
    justifyContent: "center",
  },

  colorText: {
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
    opacity: 100,
  },

  colors: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  color: {
    borderRadius: 20,
    width: 40,
    height: 40,
    marginTop: 15,
    marginRight: 25,
  },

  button: {
    height: 60,
    width: "88%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#757083",
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
