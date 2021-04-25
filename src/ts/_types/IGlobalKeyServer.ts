import { IGlobalKeyListener } from "./IGlobalKeyListener";

/**
 * Global key-server interface - all OSes will attempt to implement this server interface in order to 
 */
export type IGlobalKeyServer = {
  /**
   * Add a key listener to the key server. The keyserver is started when the first listener is added.
   * @param listener - This key listener will be called whenever a key event is pressed/released.
   */
  addListener: (listener:IGlobalKeyListener)=>void,
  
  /**
   * Remove a key listener from the key server. The keyserver is stopped when the last listener is removed.
   * @param listener - The key listener which was previously added to the server which you want to be removed.
   */
  removeListener: (listener:IGlobalKeyListener)=>void,
  
  /**
   * Start the keyserver.
   * @protected
   */
  start: ()=>void,
  
  /**
   * Stop the keyserver.
   * @protected
   */
  stop: ()=>void,
}