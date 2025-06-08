// components/pdf/VendorPDF.js
import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font
} from '@react-pdf/renderer';
import { formatISODate } from '../../utils/helper';
const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 11, fontFamily: 'Helvetica' },
  section: { marginBottom: 15 },
  header: { fontSize: 16, marginBottom: 8, fontWeight: 'bold' },
  row: { flexDirection: 'row', marginBottom: 4 },
  label: { width: '25%', fontWeight: 'bold' },
  value: { width: '75%' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#f0f0f0', padding: 5 },
  tableRow: { flexDirection: 'row', padding: 5 },
  col: { width: '14.2%' },
  title: { fontSize: 14, marginBottom: 6, fontWeight: 'bold' },
});

const VendorPDF = ({ vendor, transactions, totals, balance }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.section}>
        <Text style={styles.header}>Vendor Report</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Company Name:</Text>
          <Text style={styles.value}>{vendor.companyName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Vendor Type:</Text>
          <Text style={styles.value}>{vendor.vendorType}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Contact Number:</Text>
          <Text style={styles.value}>{vendor.contactNumber}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.value}>{vendor.address}</Text>
        </View>
      </View>

      {/* Financial Overview */}
      <View style={styles.section}>
        <Text style={styles.title}>Financial Summary</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Total Credits:</Text>
          <Text style={styles.value}>₹{totals.credits.toLocaleString('en-IN')}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Total Debits:</Text>
          <Text style={styles.value}>₹{totals.debits.toLocaleString('en-IN')}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Current Balance:</Text>
          <Text style={styles.value}>₹{balance.toLocaleString('en-IN')}</Text>
        </View>
      </View>

      {/* Transactions Table */}
      <View style={styles.section}>
        <Text style={styles.title}>Transactions</Text>
        <View style={styles.tableHeader}>
          {['Date', 'Type', 'Amount', 'Discount', 'Due Date', 'Added By', 'Purpose'].map((col, i) => (
            <Text key={i} style={styles.col}>{col}</Text>
          ))}
        </View>
        {transactions.map((txn, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={styles.col}>{formatISODate(txn.date)}</Text>
            <Text style={styles.col}>{txn.type}</Text>
            <Text style={styles.col}>₹{txn.amount.toLocaleString('en-IN')}</Text>
            <Text style={styles.col}>{txn.discount ? `-₹${txn.discount}` : '-'}</Text>
            <Text style={styles.col}>{txn.type === 'Due' && txn.dueDate ? formatISODate(txn.dueDate) : '-'}</Text>
            <Text style={styles.col}>{txn.addedBy?.name || 'System'}</Text>
            <Text style={styles.col}>{txn.purpose || '-'}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default VendorPDF;
