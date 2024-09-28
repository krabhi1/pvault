# pvault

This project provides a secure way to store private data by encrypting it before saving it to public places like GitHub Gist. By encrypting the data, it ensures confidentiality and protection from unauthorized access, even if someone gains access to the Gist. We don't store password and if you forget your password you never recover your data so you must save your password somewhere.


### Features

- **Data Encryption**: Uses robust encryption algorithms to secure data.
- **GitHub Gist Integration**: Conveniently stores encrypted data in GitHub Gist.
- **Data Privacy**: Ensures that data remains confidential and accessible only with the decryption key.

### Limitations

- **Password Recovery**: If a user forgets their password, they cannot recover their data, as decryption relies on the password.
- **Daily Account Creation Limit**: For security reasons, there may be a limit on the number of new accounts created per day.
