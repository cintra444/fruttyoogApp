import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #f2f2f2;
  padding: 20px;
`;

export const Logo = styled.Image`
  width: 120px;
  height: 120px;
  margin-bottom: 20px;
`;

export const WelcomeText = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  text-align: center;
`;

export const QuestionText = styled.Text`
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
  text-align: center;
`;

export const Input = styled.TextInput`
  width: 100%;
  height: 50px;
  background-color: #fff;
  border-radius: 10px;
  padding: 0 15px;
  margin-bottom: 15px;
  font-size: 16px;
  border-width: 1px;
  border-color: #ccc;
`;

export const Button = styled.TouchableOpacity`
  width: 100%;
  height: 50px;
  background-color: #4caf50;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
`;

export const ButtonText = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
`;
