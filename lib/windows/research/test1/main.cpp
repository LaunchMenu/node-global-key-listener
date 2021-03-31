#include <stdio.h>
#include <iostream>
#include <string>

//Headers
bool stdSendMessage(int charCode, bool isDown);


//Main
int main(int argc, char** argv) {
   int i=0;
   bool result = false;
   while(true){
      i++;
      result = stdSendMessage(i,result);
   }
}

//Declares
using namespace std;
bool stdSendMessage(int charCode, bool isDown){
   //Print to out
   printf("%i,%s\n",charCode, (isDown ? "DOWN" : "UP"));
   fflush(stdout);

   string line;
   getline(cin, line);
   return line == "1";
}
