import React from 'react';
import { StyleSheet, StatusBar, Text, View, Button, TouchableOpacity } from 'react-native';

export default function AlarmElement(props) {
  return (
    <View style={styles.container}>
      <Text style={styles.toDoText}>{props.dateText}</Text>
      <Text style={styles.toDoText}>{props.timeText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 90,
    width: "94%",
    marginBottom: 15,
    borderRadius: 12,
    borderWidth: 1.4,
    borderColor: "#c1d3d7",
    backgroundColor: '#47646c',
    flexDirection: "row",
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 12,
    justifyContent: 'space-between',
  },
  toDoText: {
    fontSize: 16,
    maxWidth: "90%",
    color: "white"
  },
  deleteIcon: {
    height: 35,
    width: 35,
    justifyContent: "center",
    alignItems: "center"
  }
});