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


  useEffect(() => {
    if (mode === "time" && effectDate > Date.now() && effectType === "set" && timeText !== "Empty"){
      setAlarms([...alarms, {date: dateText, time: timeText, key: `${Math.floor(Math.random() * 300)}`}]);
    }
  }, [timeText])


  const onChange = async (event, selectedDate) => {
    const choosingDate = selectedDate.getTime() > (Date.now() - (new Date().getHours() * 3600000 + 
    new Date().getMinutes() * 60000 + 
    new Date().getSeconds() * 1000))

    const choosingTime = selectedDate.getTime() > Date.now();

    console.log(selectedDate);

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
      // console.log(fTime);
      // console.log(timeText);

      if (mode === "date"){
        setDate(currentDate);
        showMode("time");
      }

      if (mode === "time"){
        setEffectDate(currentDate);
        setEffectType(event.type);
        setTimeText(fTime);
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
    // if (event.type === "set" && mode === "time" && selectedDate.getTime() > Date.now()){
      
    // }
  }

  const showMode = (currentMode) => {
    setMode(currentMode);
    setShow(true);
  }


  // const handleNotification = () => {
  //   PushNotification.localNotificationSchedule({
  //     channelId: "test-channel",
  //     title: "ALARM",
  //     message: "TEST",
  //     date: new Date(Date.now() + 5 * 1000),
  //     allowWhileIdle: true,
  //     id: 1
  //   });
  // }

  // const handleCancelNotification = () => {
  //   PushNotification.cancelLocalNotification("1");
  // }

  const handleAddAlarmPress = () => {
    showMode("date");
    setDate(new Date());
  }

  const handleDelPress = (index) => {
    const newAlarms = [...alarms]
    newAlarms.splice(index, 1)
    setAlarms(newAlarms)
  }
  
  const [separator, setSeparator] = useState({})

  useEffect(() => {
    if (alarms.length !== 0){
      setSeparator({width: "80%", borderBottomWidth: 1, borderColor: "darkgray", marginBottom: 15})
    }
  },[alarms.length])



  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{alignItems: "center"}} style={{width: "100%", paddingTop: 15}}>
        {alarms.map((item) => {
          return (
            <AlarmElement key={item.key} dateText={item.date} timeText={item.time}/>
          )
        })}
        <View style={separator}/>
        <Text style={{fontWeight: "bold", fontSize: 20, color: "white"}}>{dateText}</Text>
        <Text style={{fontWeight: "bold", fontSize: 20, color: "white"}}>{timeText}</Text>
        <TouchableOpacity onPress={handleAddAlarmPress} style={styles.testButton}>
          <Text style={styles.testButtonText}>Add Alarm</Text>
        </TouchableOpacity>
        <Button title="delete" onPress={() => {handleDelPress(0)}}/>
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