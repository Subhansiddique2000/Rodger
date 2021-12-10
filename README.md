# Rodger
This is a Banking Chatbot mobile application that works on both IOS and Android. The bot understands user queries and creates an appropriate response. You tell the bot "I want to open a checking account" and it will give you an appropriate responce.
## Technology Used
* React Native
* DialogFlow
* Firebase
## What I learned
* A good understanding of React Native
* How to use DialogFlow to create a chatbot and how to connect it to my app
* How to send and receive messages from DialogFlow 
* How to extract only the text from on object
* how to use Firebase in my app and set up a log in page
## Usage
Open terminal and cd to the directory 
```bash
cd Rodger-main
npm install
cd ios
pod install
pod update
cd ..
react-native run-ios #this will run the app in an IOS simulator
```
You only need to install the packages and pods once after that you can just type this command in the root directory when you want to run it.
```bash
react-native run-ios
```
## How it Works
This is the basic flow of the application.
### Rendering the Component
So it all starts when our component is rendered and the user types a message, for example “I want to open a checking account” and clicks send. 
```bash
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
```
Then our ```onSend(message)``` function is triggered and we forward an object ```message``` to ```onSend()``` and this object may contain information like text, ID, user etc. 
### onSend(message)
Once our ```onSend(message)``` function receives the information from the object ```message```. We store it to the messages state.
```bash
 onSend(messages =[]){
   this.setState((previouseState) => ({
     messages: GiftedChat.append(previouseState.messages, messages)
   }));
```
Then we are extracting only a single value from messages which is text. Since we only need the text or as the previous example “I want to open a checking account”. We do this to forward just the text to DialogFlow.
```bash
let text = messages[0].text;
```
DialogFlow does not need all the information the object contains, it only needs the text that the user has sent.
```bash
 Dialogflow_V2.requestQuery(
     text,
     (result) => this.handleGoogleResponse(result),
     (error) => console.log(error)
   );
```
DialogFlow will produce an appropriate response and give it back to the chatbot and we store that response as a variable called ```result``` and we forward it to another function called ```handleGoogleResponce(result)```.
## handleGoogleResponce(result)
That object ```result``` that DialogFlow sends will have a lot of data that we don’t need, we only need a text response.
```bash
 handleGoogleResponse(result){
   let text = result.queryResult.fulfillmentMessages[0].text.text[0];
   this.sendBotResponse(text);
 }
```
You can see above how we extract only the text from the object ```result``` and we save it into a variable called ```text```. Now since we have just the text we need to display that to the user and we do that by sending text to a function called ```sendBotResponce(text)```.
## sendBotResponce(text)
This function shows the response from DialogFlow to the user. We passed that text and then we create an object ```msg```.
```bash
 async sendBotResponse(text){
   let msg;
     msg = {
        text,
       createdAt: new Date().getTime(),
       user: BOT
     };
```
That object ```msg``` contains text, we also create the time the message was generated and lastly we define the user which in this case is BOT. Then we also append that whole object ```msg``` to our messages state.
```bash
   this.setState((previouseState) => ({
     messages: GiftedChat.append(previouseState.messages,
       [msg])
   }));
```
This allows the user to see the message.



