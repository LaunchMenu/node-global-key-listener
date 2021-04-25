import {GlobalKeyboardListener} from "."
const v = new GlobalKeyboardListener();
v.addListener(function(e){
  console.log(e.key.name);
});
v.addListener(function(e){
  if (e.key.name == "A"){
      console.log("Halt A")
      return true;
  }
});
v.addListener(function(e){
  if(e.key.name == "S"){
      console.log("Halt S")
      return {stopPropagation: true};
  }
});
v.addListener(function(e){
  if(e.key.name == "D"){
      console.log("Halt D Immediate")
      return {stopImmediatePropagation: true};
  }
  
});
v.addListener(function(e){
  if(e.key.name == "D"){
      console.log("This shouldn't call D")
      return {stopImmediatePropagation: e.key.name == "D"};
  }
});

v.addListener(function(e){
  if(e.key.name == "B"){
      v.stop()
  }
});