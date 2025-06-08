import { Document, Page, Text, View } from '@react-pdf/renderer';
import { styles } from './Styles';
import {formatISODate} from "../../utils/helper.js"
import { formatDate } from 'date-fns';
const ProjectPDF = ({ totals,project, transactions }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.header}> {project.title}</Text>
        <Text style={styles.sub}> {project.description}</Text>
        <Text>Status: {project.status}</Text>
        <Text>Budget: ₹{project.estimatedBudget.toLocaleString('en-IN')}</Text>
        <Text>Total Credits: ₹{totals.credits}</Text>
        <Text>Total Debits: ₹{totals.debits}</Text>

      </View>

      <View style={styles.section}>
        <Text style={styles.header}>Transactions</Text>
        <View style={styles.tableHeader}>
          {['Date', 'Type', 'Amount', 'Discount', 'Due Date', 'Added By', 'Purpose'].map(col => (
            <Text key={col} style={styles.col}>{col}</Text>
          ))}
        </View>
        {transactions.map((txn, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={styles.col}>{ formatISODate(txn.date)}</Text>
            <Text style={styles.col}>{txn.type}</Text>
            <Text style={styles.col}>₹{txn.amount}</Text>
            <Text style={styles.col}>{txn.discount || '-'}</Text>
            <Text style={styles.col}>{txn.dueDate ? formatISODate(txn.dueDate)  : '-'}</Text>
            <Text style={styles.col}>{txn.addedBy?.name || '-'}</Text>
            <Text style={styles.col}>{txn.purpose || '-'}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default ProjectPDF;
