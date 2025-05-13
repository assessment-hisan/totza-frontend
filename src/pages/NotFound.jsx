import React from 'react';

const NotFound = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Oops!</h1>
      <h2 style={styles.subtitle}>404 - Page Not Found</h2>
      <p style={styles.message}>We're sorry, but the page you requested could not be found.</p>
      <p style={styles.link}>
        <a href="/" style={styles.linkText}>Go back to the homepage</a>
      </p>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    textAlign: 'center',
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: '4em',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '2.5em',
    color: '#555',
    marginBottom: '20px',
  },
  message: {
    fontSize: '1.2em',
    color: '#777',
    marginBottom: '30px',
  },
  link: {
    marginTop: '20px',
  },
  linkText: {
    color: '#007bff',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};

export default NotFound;