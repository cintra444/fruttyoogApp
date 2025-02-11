import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { styles } from './styles';

interface TableDadosProps {
    data: Array<{ [key: string]: any }>;
}

const TableDados: React.FC<TableDadosProps> = ({ data }) => {
    if (data.length === 0) {
        return <Text style={styles.noDataText}>Nenhum dado encontrado</Text>;
    }

    const headers = Object.keys(data[0]);

    return (
        <ScrollView horizontal>
            <View style={styles.table}>
                <View style={styles.tableRow}>
                    {headers.map((header) => (
                        <Text key={header} style={styles.tableHeader}>
                            {header}
                        </Text>
                    ))}
                </View>
                {data.map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.tableRow}>
                        {headers.map((header) => (
                            <Text key={header} style={styles.tableCell}>
                                {row[header]}
                            </Text>
                        ))}
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};


export default TableDados;