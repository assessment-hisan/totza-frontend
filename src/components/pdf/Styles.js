// components/pdf/Shared/Styles.js
import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 11, fontFamily: 'Helvetica' },
  header: { fontSize: 16, marginBottom: 3, fontWeight: 'bold' },
  sub: { fontSize: 12, marginBottom: 10, fontWeight: 'semibold' },
  section: { marginBottom: 10 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#f0f0f0', padding: 5 },
  tableRow: { flexDirection: 'row', padding: 5 },
  col: { width: '14.2%' },
});
