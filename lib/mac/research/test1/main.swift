import Foundation
import Darwin.C

//Autoflush
setbuf(stdout, NULL);

//print and wait for new data
func haltPropogation(data: int){
    print(data)
    return Bool(readLine(strippingNewline: true)!)!
}

int i=0;
bool result = false;
while(true){
    i++;
    result = stdSendMessage(i,result);
}