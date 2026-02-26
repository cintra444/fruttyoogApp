const packageJson = require('./package.json');
const incompatibilidades = [];

// Verificar pacotes que podem precisar de atualizacao
const pacotesCriticos = [
  '@react-navigation/native',
  '@react-navigation/stack',
  '@react-navigation/bottom-tabs',
  'react-native-screens',
  'react-native-safe-area-context',
  '@react-native-community/datetimepicker',
  'react-native-gesture-handler',
  'react-native-reanimated',
  'react-native-svg'
];

console.log('Verificando compatibilidade com React Native 0.76...\n');

pacotesCriticos.forEach(pacote => {
  if (packageJson.dependencies[pacote]) {
    console.log(`${pacote}: ${packageJson.dependencies[pacote]}`);
  }
});

console.log('\nPara React Native 0.76, instale as vers�es:');
console.log('npm install @react-navigation/native@^7.0.0');
console.log('npm install react-native-screens@~4.0.0');
console.log('npm install react-native-safe-area-context@5.0.0');
console.log('npm install @react-native-community/datetimepicker@8.0.0');
console.log('npm install react-native-gesture-handler@~2.20.0');
console.log('npm install react-native-reanimated@~3.16.0');

