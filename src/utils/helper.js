export const  validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email)
}
export const validatePassword = (password) => {
  return password.length >= 8;
};
export const getInitials = (name) => {
    if (!name) return "";
    const words = name.split(" ");
    let initials = "";
  
    for (let i = 0; i < Math.min(words.length, 2); i++) {
      initials += words[i][0];
    }
  
    return initials.toUpperCase();
  };
  

export const  sortByDate = (arr, dateKey, ascending = true) => {
    return arr.sort((a, b) => {
      const dateA = new Date(a[dateKey]);
      const dateB = new Date(b[dateKey]);
      return ascending ? dateA - dateB : dateB - dateA;
    });
  }

  export function formatISODate(isoDate) {
    const date = new Date(isoDate);
    const dateOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };

    const formattedDate = date.toLocaleDateString('en-US', dateOptions);
    const formattedTime = date.toLocaleTimeString('en-US', timeOptions);

    return `${formattedDate}, ${formattedTime}`;
}

// Helper function to calculate net balance (credits - debits)
export const calculateTotalBalance = (transactions) => {
  if (!transactions || transactions.length === 0) return 0;
  
  return transactions.reduce((balance, txn) => {
    if (!txn) return balance;
    
    const amount = Number(txn.amount) || 0;
    const type = txn.type?.toLowerCase();
    
    if (type === 'credit') {
      return balance + amount;
    } else if (type === 'debit') {
      return balance - amount;
    }
    return balance;
  }, 0);
};

export const calculateMonthlyTotal = (transactions, type) => {
  if (!transactions || transactions.length === 0) return 0;
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  return transactions.reduce((total, txn) => {
    if (!txn) return total;
    
    const txnDate = new Date(txn.date || txn.createdAt);
    const txnAmount = Number(txn.amount) || 0;
    const txnType = txn.type?.toLowerCase();
    
    // Check if transaction is from current month and matches requested type
    if (txnDate.getMonth() === currentMonth && 
        txnDate.getFullYear() === currentYear &&
        txnType === type.toLowerCase()) {
      return total + txnAmount;
    }
    return total;
  }, 0);
};