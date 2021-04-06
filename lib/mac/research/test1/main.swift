//import Foundation
import func Swift.print
import func Swift.readLine
import func Darwin.C.setbuf
import func Darwin.C.fflush
import var Darwin.C.stdout
import var Darwin.C.NULL

//print and wait for new data
func stdSendMessage(key: Int, oldResult: Bool) -> Bool {
    print("\(key),\(oldResult)")
    fflush(stdout)
    guard let line: String = readLine(strippingNewline: true) else {return false}
    return line=="1"
}

var i: Int=0;
var result: Bool = false;
while(true){
    i+=1
    result = stdSendMessage(key: i, oldResult: result)
}


