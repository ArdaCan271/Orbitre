import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Image,
  Text,
  View,
  Pressable,
  Keyboard,
  Dimensions,
  ScrollView,
} from 'react-native';
import {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SweetAlert from 'react-native-sweet-alert';
import OneSignal from 'react-native-onesignal';

export default function LogInScreen({navigation}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState(<Text></Text>);

  const [usernameTextColor, setUsernameTextColor] = useState('#1d877c');
  const [passwordTextColor, setPasswordTextColor] = useState('#1d877c');
  const [passwordBorderWidth, setPasswordBorderWidth] = useState(0);
  const [usernameBorderWidth, setUsernameBorderWidth] = useState(0);

  const [forgotPasswordDecor, setForgotPasswordDecor] = useState('');

  const errorMessage = () => {
    if (password === '' && username !== '') {
      //return (<Text style={textStyles.errorText}>Please enter your password.</Text>)
      SweetAlert.showAlertWithOptions({
        title: '',
        subTitle: 'Please enter your password.',
        confirmButtonTitle: 'OK',
        confirmButtonColor: '#eb4034',
        otherButtonTitle: 'Cancel',
        otherButtonColor: '#dedede',
        style: 'warning',
        cancellable: true,
      });
    } else if (username === '') {
      //return (<Text style={textStyles.errorText}>Please enter your username.</Text>)
      SweetAlert.showAlertWithOptions({
        title: 'Error',
        subTitle: 'Please enter your username.',
        confirmButtonTitle: 'OK',
        confirmButtonColor: 'red',
        otherButtonTitle: 'Cancel',
        otherButtonColor: '#dedede',
        style: 'warning',
        cancellable: false,
      });
    } else if (username !== 'admin' || password !== 'admin') {
      //return (<Text style={textStyles.errorText}>Wrong username or password.</Text>)
      SweetAlert.showAlertWithOptions({
        title: 'Error',
        subTitle: 'Wrong username or password.',
        confirmButtonTitle: 'OK',
        confirmButtonColor: 'red',
        otherButtonTitle: 'Cancel',
        otherButtonColor: '#dedede',
        style: 'warning',
        cancellable: false,
      });
    }
  };

  const handleOnPress = async () => {
    await AsyncStorage.setItem('username', username);
    await AsyncStorage.setItem('password', password);

    if (username === 'admin' && password === 'admin') {
      navigation.navigate('Welcome');
      setUsername('');
      setPassword('');
      OneSignal.disablePush(false);
    }
    errorMessage();
  };

  useEffect(() => {
    async function autoLogin() {
      const storedUsername = await AsyncStorage.getItem('username');
      const storedPassword = await AsyncStorage.getItem('password');

      if (storedUsername === 'admin' && storedPassword === 'admin') {
        navigation.navigate('Welcome');
      }
    }
    autoLogin();
  }, []);

    return (
    <ScrollView style={{height: "100%"}}>
      <Pressable android_disableSound={true} onPress={Keyboard.dismiss} style={styles.container}>
        <StatusBar backgroundColor={"#101719"}/>
        <View style={styles.loginContainer}>
          <Text style={styles.appName}>ORBITRE</Text>
          <Image source={require('../assets/app-logo.png')} style={styles.logoImage} resizeMode="contain"/>
          <View style={styles.usernameBoxContainer}>
            <Text style={[styles.usernameBoxText, {color: usernameTextColor}]}>Email or username</Text>
            <TextInput
              onPressIn={() => {setUsernameTextColor('#2dd2c2'); setUsernameBorderWidth(1);}}
              onEndEditing={() => {setUsernameTextColor('#1d877c'); setUsernameBorderWidth(0);}}
              style={[styles.usernameBox, {borderWidth: usernameBorderWidth}]}
              placeholder="Email or username"
              value={username}
              onChangeText={setUsername}></TextInput>
          </View>
          <View style={styles.passwordBoxContainer}>
            <Text style={[styles.passwordBoxText, {color: passwordTextColor}]}>Password</Text>
            <TextInput
              secureTextEntry={true}
              onPressIn={() => {setPasswordTextColor('#2dd2c2'); setPasswordBorderWidth(1);}}
              onEndEditing={() => {setPasswordTextColor('#1d877c'); setPasswordBorderWidth(0);}}
              style={[styles.passwordBox, {borderWidth: passwordBorderWidth}]}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              textContentType="password"
              autoCapitalize="none"></TextInput>
          </View>
          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Forgot your password?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleOnPress} style={styles.loginTouchable}>
            <Text style={styles.loginbuttonText}>Log In</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.registerPromptView}>
          <Text style={styles.registerPrompt}>Don't have an account? </Text>
          <TouchableOpacity>
            <Text style={[styles.registerPrompt, {color: '#2dd2c2'}]}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.get("window").height - StatusBar.currentHeight,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#202e32',
  },
  loginContainer: {
    width: "100%",
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#202e32',
  },
  appName: {
    marginTop: 30,
    fontSize: 60,
    color: 'cyan',
    fontFamily: 'spantaran',
    textShadowColor: 'cyan',
    textShadowRadius: 12,
  },
  logoImage: {
    height: 110,
    tintColor: 'cyan',
  },
  usernameBoxContainer: {
    width: '80%',
    height: 55,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  usernameBoxText: {
    alignSelf: 'flex-start',
    fontSize: 17,
    color: '#1d877c',
  },
  usernameBox: {
    width: '100%',
    height: 38,
    backgroundColor: '#385056',
    borderWidth: 0,
    borderColor: 'cyan',
    fontSize: 15,
    paddingLeft: 15,
    paddingBottom: 0,
    paddingTop: 0,
    borderRadius: 5,
    color: 'white',
  },
  passwordBoxContainer: {
    width: '80%',
    height: 55,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  passwordBoxText: {
    alignSelf: 'flex-start',
    fontSize: 17,
    color: '#1d877c',
  },
  passwordBox: {
    width: '100%',
    height: 38,
    backgroundColor: '#385056',
    borderWidth: 0,
    borderColor: 'cyan',
    fontSize: 15,
    paddingLeft: 15,
    borderRadius: 5,
    color: 'white',
  },
  forgotPassword: {
    color: '#2dd2c2',
    fontSize: 15,
    marginTop: 16,
  },
  loginTouchable: {
    width: '25%',
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'cyan',
    borderRadius: 20,
    marginTop: 30
  },
  loginbuttonText: {
    fontSize: 20,
    color: '#2a3332',
    fontFamily: 'sans-serif-light',
  },
  registerPromptView: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  registerPrompt: {
    color: 'darkgray',
  },
});
