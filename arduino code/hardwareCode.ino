int pir=13;
int outrelay1=2;
int outrelay2=4;
int esp=8;
int moniter1 = 3;
int moniter2 = 5;
int onlinein=11;
int onlineout=12;
const int crntAtA0 = A0;
const int crntAtA1 = A1;

void setup()
{
  pinMode(pir,INPUT);
  pinMode(outrelay1,OUTPUT);
  pinMode(outrelay2,OUTPUT);
  pinMode(esp,INPUT);
  pinMode(onlinein,INPUT);
  pinMode(onlineout,OUTPUT);
  pinMode(moniter1,OUTPUT);
  pinMode(moniter2,OUTPUT);
}
void allon()
{
digitalWrite(outrelay1,LOW);
digitalWrite(outrelay2,LOW);
}
void alloff()
{
digitalWrite(outrelay1,HIGH);
digitalWrite(outrelay2,HIGH);
}
float getVPP(int sensorIn)
{
  float result;
  int readValue;             // value read from the sensor
  int maxValue = 0;          // store max value here
  int minValue = 1024;       // store min value here

   uint32_t start_time = millis();
   while((millis()-start_time) < 250)  // sample for 1 Sec
   {
       readValue = analogRead(sensorIn);
       // see if you have a new maxValue
       if (readValue > maxValue) 
       {
            /*record the maximum sensor value*/
           maxValue = readValue;
       }
       if (readValue < minValue) 
       {
           /*record the minimum sensor value*/
           minValue = readValue;
       }
   }

   // Subtract min from max
   result = ((maxValue - minValue) * 5.0)/1024.0;

   return result;
 }


double getCrnt(int sensorIn){
  double Voltage = 0;
  double VRMS = 0;
  double AmpsRMS = 0;
  int mVperAmp = 100;
  Voltage = getVPP(sensorIn);
  VRMS = (Voltage/2.0) *0.707;  //root 2 is 0.707
  AmpsRMS = (VRMS * 1000)/mVperAmp;
  return AmpsRMS;
}



void loop()
{
  if(digitalRead(esp)==HIGH)
  {
       if(digitalRead(pir)==HIGH)
       {
         allon();
       }
  }
  else
  {
    alloff();
  }
  if(digitalRead(onlinein)==HIGH)
  {
    digitalWrite(onlineout,HIGH);
  }
  else
  {
    digitalWrite(onlineout,LOW);
  }
  float crnt1 = getCrnt(crntAtA0);
  float crnt2 = getCrnt(crntAtA1);
    Serial.println(crnt1);
    Serial.println(crnt2);
    if( crnt1 > 0.22)
    {
        digitalWrite(moniter1, HIGH);
    }
    else{
        digitalWrite(moniter1, LOW);
    }
    if(crnt2 > 0.22)
    {
      digitalWrite(moniter2,HIGH);
    }
    else
    {
      digitalWrite(moniter2,LOW);
    }
    
}