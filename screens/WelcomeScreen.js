import React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Text, View, Image, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';
import DateTimePicker from '@react-native-community/datetimepicker';

import AlarmElement from '../components/AlarmElement';

export default function WelcomeScreen({navigation}) {

  const createChannels = () => {
    PushNotification.createChannel({
      channelId: "test-channel",
      channelName: "Test Channel"
    })
  }

  const handleOnPress = async () => {
    await AsyncStorage.setItem("username", "");
    await AsyncStorage.setItem("password", "");

    navigation.goBack()
  }

  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <View style={{
          height: 80,
          width: "100%",
          backgroundColor: "#202e32",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
          }}>
          <Text style={{
            marginBottom: 10,
            marginLeft: 20,
            fontSize: 25,
            color: "cyan",

          }}>Alarms</Text>
          <Image source={require("../assets/app-logo.png")} resizeMode="contain" style={{
            height: 70,
            tintColor: "cyan",
            position: "absolute",
            alignSelf: "center",
            width: "100%",
            }}/>
          <TouchableOpacity onPress={handleOnPress} style={{
            height: 35,
            width: 60,
            backgroundColor: "#dc5866",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 10,
            marginRight: 20,
            borderRadius: 20,
          }}>
            <Text style={{color: "white"}}>Log Out</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    createChannels();
  }, [])

  const [alarms, setAlarms] = useState([
    {name: "aaa", key: "1"},
    {name: "bbb", key: "2"},
    {name: "ccc", key: "3"},
    {name: "ddd", key: "4"},
    {name: "eee", key: "5"},
    // {name: "fff", key: "6"},
    // {name: "ggg", key: "7"},
    // {name: "hhh", key: "8"},
    // {name: "jjj", key: "9"},
    // {name: "kkk", key: "10"},
    // {name: "lll", key: "11"},
    // {name: "mmm", key: "12"},
  ])



  const handleNotification = () => {
    PushNotification.localNotificationSchedule({
      channelId: "test-channel",
      title: "ALARM",
      message: "TEST",
      date: new Date(Date.now() + 5 * 1000),
      allowWhileIdle: true,
      id: 1
    });
  }

  const handleCancelNotification = () => {
    PushNotification.cancelLocalNotification("1");
  }

  


  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{alignItems: "center"}} style={{width: "100%", paddingTop: 15}}>
        {alarms.map((item) => {
          return (
            <AlarmElement text={item.name}/>
          )
        })}
        <TouchableOpacity style={styles.testButton}>
          <Text style={styles.testButtonText}>Add Alarm</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#32474c",
  },
  testButton: {
    width: "94%",
    height: 90,
    borderWidth: 1.4,
    borderColor: "#c1d3d7",
    backgroundColor: '#47646c',
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    alignSelf: "center",
    marginBottom: 30,
  },
  testButtonText: {
    color: "white",
    fontSize: 20,
  },
});