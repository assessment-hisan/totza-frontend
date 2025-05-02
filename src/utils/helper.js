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

