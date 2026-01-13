// styles.ts
import styled from 'styled-components/native';

export const Container = styled.ScrollView`
  flex: 1;
  background-color: #f5f5f5;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin: 20px 0;
`;

export const StatsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin: 0 10px;
  flex-wrap: wrap;
`;

export const StatsCard = styled.View<{ backgroundColor?: string }>`
  background-color: ${props => props.backgroundColor || '#2196F3'};
  border-radius: 12px;
  padding: 15px;
  margin: 5px;
  flex: 1;
  min-width: 110px;
  align-items: center;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
`;

export const StatsTitle = styled.Text`
  color: white;
  font-size: 12px;
  text-align: center;
  margin-bottom: 5px;
  font-weight: 600;
`;

export const StatsValue = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 5px;
`;

export const StatsLabel = styled.Text`
  color: rgba(255, 255, 255, 0.9);
  font-size: 11px;
  text-align: center;
`;

export const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
`;

export const LoadingText = styled.Text`
  margin-top: 10px;
  color: #666;
  font-size: 14px;
`;

export const PaymentTypeContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  padding: 15px;
  margin-bottom: 8px;
  border-radius: 10px;
  elevation: 1;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.05;
  shadow-radius: 2px;
`;

export const PaymentTypeItem = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const PaymentTypeIcon = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #f0f7ff;
  justify-content: center;
  align-items: center;
`;

export const PaymentTypeText = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

export const PaymentTypeValue = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #2196F3;
`;