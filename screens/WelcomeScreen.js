import React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, Keyboard, Appearance, ScrollView, TouchableOpacity, Text, View, Image, Platform, Button, Modal, TextInput, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';
import SweetAlert from 'react-native-sweet-alert';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/AntDesign';

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
      channelName: "Test Channel",
      playSound: true,
      soundName: "newalarm.mp3",
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
          height: 65,
          width: "100%",
          backgroundColor: "#202e32",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          }}>
          <Text style={{
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
    createChannels();
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
  const [selectedDate, setSelectedDate] = useState();
  const [effectType, setEffectType] = useState("");
  const [show, setShow] = useState(false);
  const [dateText, setDateText] = useState("Empty")
  const [timeText, setTimeText] = useState("Empty")

  const [inputBorderColor, setInputBorderColor] = useState("gray")
  const [alarmDescription, setAlarmDescription] = useState("")
  const [modalOpen, setModalOpen] = useState(false)


  const onChange = (event, selectedDate) => {
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
        setSelectedDate(currentDate);
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
      setDate(new Date());
      setAlarmDescription("");
    }else if(event.type === "dismissed"){
      setShow(false);
      setDate(new Date());
      setMode("date");
      setAlarmDescription("");
    }
  }

  const showMode = (currentMode) => {
    setMode(currentMode);
    setShow(true);
  }


  const handleNotification = (key, selectedDate, alarmMessage) => {
    PushNotification.localNotificationSchedule({
      channelId: "test-channel",
      title: "⏰",
      message: alarmMessage,
      date: new Date(selectedDate),
      allowWhileIdle: true,
      id: key,
      playSound: true,
      soundName: "newalarm.mp3"
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
    }else{
      setSeparator({})
    }
  },[alarms.length])


  useEffect(() => {
    if (mode === "time" && selectedDate > Date.now() && effectType === "set" && timeText !== "Empty"){

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
      const alarmDate = new Date(selectedDate.getTime() - (selectedDate.getSeconds() * 1000))
      setAlarms([...alarms, {key: alarms.length, 
                             notificationId: randomId, 
                             selectedDate: alarmDate, 
                             alarmMessage: alarmDescription}]);
      handleNotification(randomId, alarmDate, alarmDescription);
      setAlarmDescription("");
    }
  }, [timeText])

  const modalColor = Appearance.getColorScheme() === "dark" ? "#424242" : "white";
  const inputBGColor = Appearance.getColorScheme() === "dark" ? "#424242" : "white";
  const inputTextColor = Appearance.getColorScheme() === "dark" ? "white" : "black";
  const accentColor = Appearance.getColorScheme() === "dark" ? "#80cbc4" : "#008577";

  const handleOKPress = () => {
    if (alarmDescription !== ""){
      setModalOpen(false);
      setInputBorderColor("gray");
      handleAddAlarmPress();
    }else{
      SweetAlert.showAlertWithOptions({
        title: "",
        subTitle: 'Please enter an alarm description.',
        style: 'warning',
      })
    }
  }

  return (
    <View style={styles.container}>
      <Modal visible={modalOpen} transparent={true} animationType="fade">
        <Pressable 
        android_disableSound={true}
        onPress={() => {setModalOpen(false); setAlarmDescription(""); setInputBorderColor("gray")}} 
        style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)"}}>  
          <Pressable 
          android_disableSound={true}
          style={[styles.modalContainer, {backgroundColor: modalColor}]} 
          onPress={Keyboard.dismiss}>
            <TextInput
              autoFocus
              onFocus={() => {setInputBorderColor(accentColor)}}
              onPressIn={() => {setInputBorderColor(accentColor)}}
              onEndEditing={() => {setInputBorderColor("gray")}}
              style={[styles.modalTextInput, {borderColor: inputBorderColor, backgroundColor: inputBGColor, color: inputTextColor}]}
              placeholder="Enter alarm description (max 50 char.)"
              maxLength={50}
              value={alarmDescription}
              onChangeText={setAlarmDescription}></TextInput>
            <View style={{flexDirection: "row", width: "100%", justifyContent: "flex-end"}}>
              <TouchableOpacity 
                onPress={() => {setModalOpen(false); setAlarmDescription(""); setInputBorderColor("gray")}}
                style={{marginRight: 30, marginBottom: -18, height: 35, width: 75, justifyContent: "center", alignItems: "center"}}>
                <Text style={{color: accentColor, fontWeight: "500"}}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleOKPress}
                style={{marginRight: 30, marginBottom: -18, height: 35, width: 45, justifyContent: "center", alignItems: "center"}}>
                <Text style={{color: accentColor, fontWeight: "500"}}>OK</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
      <ScrollView contentContainerStyle={{alignItems: "center"}} style={{width: "100%", paddingTop: 15}}>
        {alarms.map((item) => {
          return (
            <AlarmElement 
              key={item.key} 
              onDelPress={() => {handleDelPress(item.key, item.notificationId)}}
              selectedDate={item.selectedDate}
              alarmMessage={item.alarmMessage}/>
          )
        })}
        <View style={separator}/>
        <TouchableOpacity onPress={() => setModalOpen(true)} style={styles.addAlarmButton}>
          <Icon name="plus" size={36} color="white"/>
          <Text style={styles.addAlarmButtonText}>Add Alarm</Text>
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
  modalContainer: {
    width: 350,
    height: 150,
    justifyContent: "space-around",
    alignItems: "center",
    borderRadius: 3,
  },
  modalTextInput: {
    width: '85%',
    height: 38,
    fontSize: 16,
    paddingBottom: 0,
    paddingTop: 6,
    borderBottomWidth: 2,
    borderColor: "gray"
  },
  addAlarmButton: {
    width: "94%",
    height: 90,
    borderWidth: 1.4,
    borderColor: "cyan",
    backgroundColor: '#47646c',
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    alignSelf: "center",
    marginBottom: 30,
  },
  addAlarmButtonText: {
    color: "white",
    marginLeft: 5,
    fontSize: 20,
  },
});