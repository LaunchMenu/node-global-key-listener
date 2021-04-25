/**
 * Return value from KeyListener. You can either return true/false.
 * Returning `True` will halt propogation of the key event to other processes. `False` will allow events to propogate to the rest of the system.
 * If you want to halt propogation within LaunchMenu you can also return an object containing `stopImmediatePropogation:true`.
 */
 export type IGlobalKeyResult = boolean | void | {
  /** True - stops propogation to other remote processes. False - allow propogation to other remote processes */
  stopPropagation?:boolean,
  /** True - stops propogation of event within key server. False - allow propogation of events within the keyserver */
  stopImmediatePropagation?:boolean
}