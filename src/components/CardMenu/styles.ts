import styled from 'styled-components/native';

import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export const CardContainer = styled.TouchableOpacity`
  width: ${screenWidth > 600 ? '30%' : '45%'};
  margin-bottom: 16px;
  margin-right: 10px;
  margin-left: 16px;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 16px;
  elevation: 3;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  min-height: 150px;
`;

export const IconContainer = styled.View`
    margin-right: 8px;
`;

export const CardContent = styled.View`
    flex: 1;
`;

export const Title = styled.Text`
    font-size: 16px;
    font-weight: bold;
    color: #1D71B8;
    text-align: center;
    margin-top: 8px;
`;

export const Description = styled.Text`
    font-size: 14px;
    color: #1D71B8;
    margin-top: 4px;
    text-align: center;
`;