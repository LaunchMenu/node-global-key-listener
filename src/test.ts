import {GlobalKeyboardListener} from ".";
const v = new GlobalKeyboardListener();
v.addListener(function(e){
  console.log(e.key.name);
});
v.addListener(function(e){
  if (e.key.name == "A"){
    console.log("A Halt remote propagation");
    return true;
  }
});
v.addListener(function(e){
  if(e.key.name == "S"){
    console.log("S Halt remote propagation");
    return {stopPropagation: true};
  }
});
v.addListener(function(e){
  if(e.key.name == "D"){
    console.log("D Halt listener propagation only");
    return {stopImmediatePropagation: true};
  }
});
v.addListener(function(e){
  if(e.key.name == "D"){
    console.log("This shouldn't call D");
    return {stopImmediatePropagation: e.key.name == "D"};
  }
});
v.addListener(function(e){
  if(e.key.name == "B"){
    v.stop();
  }
});