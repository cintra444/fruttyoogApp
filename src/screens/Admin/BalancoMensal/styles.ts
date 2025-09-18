import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #fff;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
`;

export const SectionTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  margin-top: 20px;
  margin-bottom: 10px;
`;

export const Table = styled.View`
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 10px;
`;

export const TableHeader = styled.View`
  flex-direction: row;
  background-color: #f2f2f2;
  padding: 10px;
`;

export const TableRow = styled.View`
  flex-direction: row;
  padding: 10px;
  border-top-width: 1px;
  border-top-color: #eee;
`;

export const TableCell = styled.Text<{ textAlign?: string }>`
  flex: 1;
  font-size: 16px;
  text-align: ${(props) => props.textAlign || "left"};
`;

export const TotalText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: right;
`;

export const BalanceText = styled.Text<{ positive: boolean }>`
  font-size: 20px;
  font-weight: bold;
  color: ${(props) => (props.positive ? "#4CAF50" : "#F44336")};
  text-align: center;
  margin-top: 20px;
`;
