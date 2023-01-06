import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default class Chat extends React.Component {
  componentDidMount() {
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });
  }
  render() {
    let color = this.props.route.params.color;
    return (
      <View style={[styles.container, { backgroundColor: color }]}>
        <Text style={styles.welcomeText}>Entering Chat...</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  welcomeText: {
    color: "#fff",
    fontSize: "17px",
  },
});
