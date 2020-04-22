

#define PINOUT 2

char currCha, prevChar;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  while(!Serial);

  pinMode(PINOUT, OUTPUT);

  Serial.println("Serial Ready");

}

void loop() {
  // put your main code here, to run repeatedly:

  if(Serial.available()){
    byte inData;
    while(Serial.available()){
      inData = (byte)Serial.read();
    }
    setOutput(inData);
    
  }

}

void setOutput(byte data){
  
  if(data == 1) {
    digitalWrite(PINOUT, HIGH);
    Serial.print("In Data: "); Serial.print(data); Serial.println(" HIGH");
  } else {
    digitalWrite(PINOUT, LOW);
    Serial.print("In Data: "); Serial.print(data); Serial.println(" LOW");
  }
}
