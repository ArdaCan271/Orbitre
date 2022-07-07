import React from 'react';
import { StyleSheet, StatusBar, Text, View, Button, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

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
        <View style={styles.reminderTextContainer}>
          <Text style={styles.reminderText}>{props.alarmMessage}</Text>
        </View>
        <View style={styles.alarmTextContainer}>
          <Icon name='calendar' size={18} color="cyan"/>
          <Text style={styles.alarmText}>{fDate}</Text>
          <Icon name='clockcircleo' size={18} color="cyan"/>
          <Text style={styles.alarmText}>{fTime}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.delButtonContainer} onPress={props.onDelPress}>
        <Icon name='close' size={35} color="#ff9ea1"/>
      </TouchableOpacity>
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
    borderColor: "cyan",
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
  reminderTextContainer: {
    flexDirection: "row",
    alignSelf: "flex-start",
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  reminderText: {
    fontSize: 19,
    maxWidth: "87%",
    maxHeight: 48,
    color: "white",
    marginBottom: 8,
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
    marginRight: 20,
    marginLeft: 6,
  }
});