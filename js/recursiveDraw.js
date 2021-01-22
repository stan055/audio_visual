
function createRecursiveDrawFunction(analyser) {
    function recursiveDrawAudio() {
      // Fill "array" with raw audio data
      analyser.getByteFrequencyData(array);
  
      const arrayHeightBars = normalizeAudioData(array);
  
      wave.draw(arrayHeightBars)
  
      window.requestAnimationFrame(recursiveDrawAudio);
    }
  
    return recursiveDrawAudio
  }
  
  
function normalizeAudioData (array) {
  const arrayHeightBars = [];
  
  // Create array height bars 
  for (let index = 0; index < array.length; index++) {
    arrayHeightBars[index] = array[index] / 255;
  }

  return arrayHeightBars;
}