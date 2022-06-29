import React from 'react';
import { StyleSheet, StatusBar, Text, View, Button, TouchableOpacity } from 'react-native';

export default function AlarmElement(props) {
  let tempDate = new Date(props.selectedDate);


  let fDate = tempDate.getDate() + 
  " / " + ((tempDate.getMonth() + 1) < 10 ? "0" + (tempDate.getMonth() + 1) : tempDate.getMonth() + 1) + 
  " / " + tempDate.getFullYear();

  let fTime = (tempDate.getHours() < 10 ? "0" + tempDate.getHours() : tempDate.getHours()) + 
  ":" + (tempDate.getMinutes() < 10 ? "0" + tempDate.getMinutes() : tempDate.getMinutes());

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.reminderText}>{props.alarmMessage}</Text>
        <View style={styles.alarmTextContainer}>
          <Text style={styles.alarmText}>{fDate}</Text>
          <Text style={styles.alarmText}>{fTime}</Text>
        </View>
      </View>
      <View style={styles.delButtonContainer}>
        <Button title='del' onPress={props.onDelPress}/>
      </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 12,
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  delButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  reminderText: {
    alignSelf: "flex-start",
    fontSize: 16,
    maxWidth: "85%",
    color: "white",
    marginBottom: 15,
  },
  alarmTextContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: 'flex-start',
    alignItems: "center"
  },
  alarmText: {
    fontSize: 16,
    color: "white",
    marginRight: 40,
  },
  deleteIcon: {
    position: "absolute",
    height: 45,
    width: 45,
    backgroundColor: "tomato",
    alignSelf: "flex-end",
  }
});