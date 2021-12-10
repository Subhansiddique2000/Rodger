import React, {Component} from 'react';
import {View, Text, SafeAreaView, ScrollView} from 'react-native';
import {GiftedChat, Bubble} from 'react-native-gifted-chat';
import {Dialogflow_V2} from 'react-native-dialogflow';
import firestore from '@react-native-firebase/firestore';
import {Card, Button} from 'react-native-elements';
import {dialogflowConfig} from '../env';
import QuickReplies from 'react-native-gifted-chat/lib/QuickReplies';


const botAvatar = require("../assets/images/s.jpeg");


const BOT = {
  _id : 2,
  name: "Rodger",
  avatar: botAvatar,
};

class Bankingbot extends Component{
  state = {
    messages : [
      // {_id: 2, text: 'What can I help You with?', createdAt: new Date().getTime(), user: BOT},
      // {_id: 1, text: 'Hi, this is Rodger your Banking Assistant.', createdAt: new Date().getTime(), user: BOT},
    ],
    id: 1,
    name: '',
  };
//
  componentDidMount(){   
    Dialogflow_V2.setConfiguration(
      dialogflowConfig.client_email,
      dialogflowConfig.private_key,
      Dialogflow_V2.LANG_ENGLISH_US,
      dialogflowConfig.project_id,
    );
    const {name, id} = this.props.route.params;
//upload to fire base
    firestore()
    .collection('CHAT_HISTORY')
    .doc(id)
    .collection('MESSAGES')
    .orderBy('createdAt', 'desc')
    .limit(15)//shows the last 15 messages
    .get()
    .then((snapshot)=> {
      let messages = snapshot.docs.map((doc) => {
        const firebaseData = doc.data();
        const data = {
          _id: doc.id,
          text: doc.text,
          createdAt: new Date().getTime(),
          ...firebaseData
        }
        if(!firebaseData.system){
          data.user = {
            ...firebaseData.user,  
            name: firebaseData.user.name
          }
        }
        return data;
      })
      //display intial message if new user
      if (messages.length>0){
        this.setState({name, id, messages})
      }else{
        this.setState({
          name,
          id,
          messages: [
            {
              _id: 2,
              text: 'What can I help You with?',
              createdAt: new Date().getTime(),
              user: BOT
            },
            {
              _id: 1,
              text: `Hello, ${this.props.route.params.name}. My name is Rodger your Banking Assistant`,
              createdAt: new Date().getTime(),
              user: BOT
            }
          ]
        })

      }
    }).catch(function (err){
      console.log(err);
    })

  }
  //sdend message dialog
  handleGoogleResponse(result){
    let text = result.queryResult.fulfillmentMessages[0].text.text[0];
    this.sendBotResponse(text);
  }
  //message that dialog flow responds
  async sendBotResponse(text){
    let msg;
    //Open Account
    if (text == "OA"){
      msg = {
        text: "Here are some options for student checking acount. Choose which one you like and I'll give you the banks information",
        createdAt: new Date().getTime(),
        user: BOT,
        isOptions: true,
        data: [{title: 'TD Bank',
        image: 'https://www.td.com/us/en/personal-banking/images/TDB_white_tcm371-253851.png',
      },//TD
      {title: 'Chase', 
      image:'https://prosperopedia.com/wp-content/uploads/2019/01/chase-bank-logo-1024x567.png',
      },//Chase
      {title: 'Bank of America', 
      image:'https://lh3.googleusercontent.com/proxy/odkxiqtw8xu2fns2SHpDqVTbz8vCJVLQOZaSrgjtEB4T039poE-9t8HIok3VeKbM48nei8beRVVrLm3q5kjXwu5eSqGkAWg8pPz-DL4al4olpm3cS58uQTobdgUJja_2NXo-3eQ',
      }//BOA
      ],
      }; 
    }
    else if (text == "TD111"){
      msg = {
        text: `You can find the nearest branch here: https://www.td.com/us/en/personal-banking/store-locator/#/ . and this is their Customer Service number: 1 (888) 751 9000. Can I help you with anything else?.`,
        createdAt: new Date().getTime(),
        user: BOT
      };
    } 
    else if (text == "Chase111"){
      msg = {
        text: `You can find the nearest branch here: https://locator.chase.com . and this is their Customer Service number: 1(800) 935 9935. Can I help you with anything else?.`,
        createdAt: new Date().getTime(),
        user: BOT
      };
    } 
    //Default bot responce 
    else if (text == "FirstRes"){
      msg = {
        text: `Hello, ${this.props.route.params.name}. My name is Rodger your Banking Assistant! What can I do for you?`,
        createdAt: new Date().getTime(),
        user: BOT
      };
    } 
    //Fallback
    else{
      msg = {
  
        text,
        createdAt: new Date().getTime(),
        user: BOT
      };

    }
    const {id} = this.props.route.params;

    firestore()
    .collection('CHAT_HISTORY')
    .doc(id)
    .collection('MESSAGES')
    .add(msg)
    msg._id = this.state.messages.length + 1;

    // Dialog flow responce----
    // let msg = {
    //   _id: this.state.messages.length + 1,
    //   text,
    //   createdAt: new Date().getTime(),
    //   user: BOT
    // };
    //-----------------

    this.setState((previouseState) => ({
      messages: GiftedChat.append(previouseState.messages,
        [msg])
    }));





  }
  
  onSend(messages =[]){
    this.setState((previouseState) => ({
      messages: GiftedChat.append(previouseState.messages, messages)
    }));

    let text = messages[0].text;
    const {id, name} = this.props.route.params;

    firestore()
    .collection('CHAT_HISTORY')
    .doc(id)
    .collection('MESSAGES')
    .add({
      text,
      createdAt: new Date().getTime(),
      user:{
        _id: 1,
        name: name,

      },
    })

    Dialogflow_V2.requestQuery(
      text,
      (result) => this.handleGoogleResponse(result),
      (error) => console.log(error)
    );
  }
  onQuickReply(quickReply){
    this.setState((previouseState) => ({
      messages: GiftedChat.append(previouseState.messages, quickReply)
    }));

    let message = quickReply[0].value;

    Dialogflow_V2.requestQuery(
      message,
      (result) => this.handleGoogleResponse(result),
      (error) => console.log(error)
    );

  }

  //still working on this feature tryna make my UI look good
  renderBubble = (props) => {
    if (props.currentMessage.isOptions){
      return(
        <ScrollView style={{backgroundColor: 'white'}}
        horizontal={true}>
          {props.currentMessage.data.map((item) => (
            <Card containerStyle={{padding: 0, borderRadius: 15, paddingBottom: 7, overflow: 'hidden',}} key={item.title}>
              <Card.Image style={{width:220, height:110}} resizeMode="cover" source={{uri: item.image}}></Card.Image>
              <Card.Divider/>
              <Card.Title>{item.title}</Card.Title>
           
              <Button
              title="Choose"
              style= {{height: 35}}
              onPress={() => this.sendBotResponse(item.title)}
              />
            </Card>
          ))}
        </ScrollView>
      );
    }else{}

  };
  
  render(){
    return(
      <View style={{flex: 1, backgroundColor: '#384776'}}>
        <GiftedChat messages={this.state.messages} 
        onSend={(message) => this.onSend(message)} onQuickReply={(quickReply) => 
          this.onQuickReply(quickReply)} 
          //feature has not been fully designed 
          //renderBubble={this.renderBubble}
          user={{_id:1}}
          />
      </View>
    );
  }
}

export default Bankingbot;


