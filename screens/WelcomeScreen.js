import React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Text, View, Image, Platform, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';
import SweetAlert from 'react-native-sweet-alert';
import DateTimePicker from '@react-native-community/datetimepicker';

import AlarmElement from '../components/AlarmElement';

export default function WelcomeScreen({navigation}) {

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("alarms")
      if (value !== null) {
        setAlarms(JSON.parse(value))
      }
    } catch (err){
      console.log(err);
    }
  }


  const createChannels = () => {
    PushNotification.createChannel({
      channelId: "test-channel",
      channelName: "Test Channel"
    })
  }


  useEffect(() => {
    createChannels();
  }, [])


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
            fontSize: 30,
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
            marginBottom: 11,
            marginRight: 10,
            borderRadius: 12,
          }}>
            <Text style={{color: "white"}}>Log Out</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);


  const [alarms, setAlarms] = useState([])


  useEffect(() => {
    getData();
  }, [])

  
  useEffect(() => {
    async function storeItems(){
      const stringifiedAlarms = JSON.stringify(alarms);
      await AsyncStorage.setItem("alarms", stringifiedAlarms)
    }
    storeItems();
  }, [alarms.length])


  const [date, setDate] = useState(new Date(Date.now()));
  const [mode, setMode] = useState("date");
  const [effectDate, setEffectDate] = useState();
  const [effectType, setEffectType] = useState("");
  const [show, setShow] = useState(false);
  const [dateText, setDateText] = useState("Empty")
  const [timeText, setTimeText] = useState("Empty")
  const [effectRandomNum, setEffectRandomNum] = useState(1)


  const onChange = async (event, selectedDate) => {
    const choosingDate = selectedDate.getTime() > (Date.now() - (new Date().getHours() * 3600000 + 
    new Date().getMinutes() * 60000 + 
    new Date().getSeconds() * 1000))

    const choosingTime = selectedDate.getTime() > Date.now();

    if ((mode === "date" ? choosingDate : choosingTime) && event.type === "set"){
      setShow(false);
      const currentDate = selectedDate;
      setDate(currentDate);

      let tempDate = new Date(currentDate);

      let fDate = tempDate.getDate() + 
      "/" + ((tempDate.getMonth() + 1) < 10 ? "0" + (tempDate.getMonth() + 1) : tempDate.getMonth() + 1) + 
      "/" + tempDate.getFullYear();
      setDateText(fDate)
    
      let fTime = (tempDate.getHours() < 10 ? "0" + tempDate.getHours() : tempDate.getHours()) + 
      ":" + (tempDate.getMinutes() < 10 ? "0" + tempDate.getMinutes() : tempDate.getMinutes());

      if (mode === "date"){
        setDate(currentDate);
        showMode("time");
      }

      if (mode === "time"){
        setEffectDate(currentDate);
        setEffectType(event.type);
        setTimeText(fTime);
        setEffectRandomNum(Math.floor(Math.random() * 10000))
      }
    }else if (selectedDate < Date.now() && event.type === "set"){
      setShow(false);
      SweetAlert.showAlertWithOptions({
        title: "",
        subTitle: 'Please choose a date in the future.',
        style: 'warning',
      });
      setMode("date");
      setDate(new Date())
      setDateText("Empty");
      setTimeText("Empty");
    }else if(event.type === "dismissed"){
      setShow(false);
      setDate(new Date())
      setDateText("Empty");
      setTimeText("Empty");
      setMode("date");
    }
  }

  const showMode = (currentMode) => {
    setMode(currentMode);
    setShow(true);
  }


  const handleNotification = (key, selectedDate) => {
    PushNotification.localNotificationSchedule({
      channelId: "test-channel",
      title: "ALARM",
      message: "TEST",
      date: new Date(selectedDate),
      allowWhileIdle: true,
      id: key
    });

  }


  const handleCancelNotification = (notificationID) => {
    PushNotification.cancelLocalNotification(notificationID.toString());
  }


  const handleAddAlarmPress = () => {
    showMode("date");
    setDate(new Date());
  }


  const handleDelPress = (index, notificationId) => {
    handleCancelNotification(notificationId);
    const newAlarms = [...alarms];
    newAlarms.splice(index, 1);
    setAlarms(newAlarms);
  }
  

  const [separator, setSeparator] = useState({})


  useEffect(() => {
    let alarmIndex = 0;
    while (alarmIndex < alarms.length){
      alarms[alarmIndex].key = alarmIndex;
      alarmIndex++;
    }

    if (alarms.length !== 0){
      setSeparator({width: "80%", borderBottomWidth: 1, borderColor: "darkgray", marginBottom: 15})
    }
  },[alarms.length])


  useEffect(() => {
    if (mode === "time" && effectDate > Date.now() && effectType === "set" && timeText !== "Empty"){

      let randomId = Math.floor(Math.random() * 1000) + 1;
      let i = 0;
      while(i < alarms.length){
        if (randomId === alarms[i].notificationId){
          randomId = Math.floor(Math.random() * 1000) + 1;
          i = 0;
          continue;
        }

        if (i === alarms.length - 1){
          break;
        }

        i++;
      }
      
      setAlarms([...alarms, {date: dateText, time: timeText, key: alarms.length, notificationId: randomId}]);
      handleNotification(randomId, effectDate)
    }
  }, [effectRandomNum])



  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{alignItems: "center"}} style={{width: "100%", paddingTop: 15}}>
        {alarms.map((item) => {
          return (
            <AlarmElement 
              key={item.key} 
              dateText={item.date} 
              timeText={item.time} 
              onDelPress={() => {handleDelPress(item.key, item.notificationId)}}/>
          )
        })}
        <View style={separator}/>
        <TouchableOpacity onPress={handleAddAlarmPress} style={styles.testButton}>
          <Text style={styles.testButtonText}>Add Alarm</Text>
        </TouchableOpacity>
        {show && (<DateTimePicker testID='dateTimePicker' value={date} mode={mode} is24Hour onChange={onChange} />)}
        <View style={{width: "100%", height: 175}}/>
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
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