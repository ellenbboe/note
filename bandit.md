## ssh
If you're connecting to another computer over the Internet, you'll probably want to keep your data safe. SSH is one way to help do that. To make it happen, you'll need to set up SSH properly on your computer, and then create an encrypted(加密) connection to your server. Just remember, in order for the connection to be secure, both ends of the connection need to have SSH enabled. Follow this guide to make sure that your connection is as safe as possible.

### Connecting for the First Time
#### Install SSH.
For Windows, you will need to download and install an SSH client program. The most popular one is Cygwin, which is available for free from the developer’s website. Download and install it like you would any other program. Another popular free program is PuTTY.
During the Cygwin installation, you must choose to install OpenSSH from the Net section.
Linux and Mac OS X come with SSH already installed on the system. This is because SSH is a UNIX system, and Linux and OS X are derived from UNIX.
If you have Windows 10 with the Anniversary Update, you can install the Windows Subsystem for Linux which comes with SSH preinstalled.

#### Run SSH.
Open the terminal program that is installed by Cygwin, or Bash on Ubuntu on Windows for Windows 10, or open the Terminal in OS X or Linux. SSH uses the terminal interface to interact with other computers. There is no graphical interface for SSH, so you will need to get comfortable typing in commands.

#### Test the connection.
Before you dive into creating secure keys and moving files, you’ll want to test that SSH is properly configured on your computer as well as the system you are connecting to. Enter the following command, replacing <username> with your username on the remote computer, and <remote> with the address for the remote computer or server:
`$ ssh <username>@<remote>`
You will be asked for your password once the connection is established. You will not see the cursor move or any characters input when you type your password.
If this step fails, then either SSH is configured incorrectly on your computer or the remote computer is not accepting SSH connections.

### basic commands(a part)
Copy files from your location to the remote computer. If you need to copy files from your local computer to the computer you are accessing remotely, you can use the scp command:
`scp /localdirectory/example1.txt <username>@<remote>:<path>`will copy example1.txt to the **specified <path> on the remote computer**. You can leave <path> blank to copy to the root folder of the remote computer.
`scp <username>@<remote>:/home/example1.txt ./` will move example1.txt from the home directory on the remote computer to the current directory on the local computer.

### Creating Encrypted Keys
#### Create your SSH keys.
These keys will allow you to connect to the remote location **without** having to enter your password each time. This is a much more secure way to connect to the remote computer, as the password will not have to transmitted over the network.
Create the key folder on your computer by entering the command `$ mkdir .ssh`
Create the public and private keys by using the command `$ ssh-keygen –t rsa`
You will be asked if you would like to create a passphrase for the keys; this is optional. If you don’t want to create a passphrase, press Enter. This will create two keys in the .ssh directory: `id_rsa` and id_`rsa.pub`
Change your private key’s permissions. In order to ensure that the private key is only **readable** by you, enter the command `$ chmod 600 .ssh/id_rsa`

#### Place the public key on the remote computer.
Once your keys are created, you’re ready to place the public key on the remote computer so that you can connect without a password. Enter the following command, replacing the appropriate parts as explained earlier:
`$ scp .ssh/id_rsa.pub <username>@<remote>:`
Make sure to include the colon (:) at the end of the command.
You will be asked to input your password before the file transfer starts.

#### Install the public key on the remote computer.
Once you’ve placed the key on the remote computer, you will need to install it so that it works correctly. First, log in to the remote computer the same way.
Create an SSH folder on the remote computer, if it does not already exist: `$ mkdir .ssh`
Append your key to the authorized keys file. If the file does not exist yet, it will be created: `$ cat id_rsa.pub >> .ssh/authorized_keys`
Change the permissions for the SSH folder to allow access: `$ chmod 700 .ssh`
#### Check that the connection works.
Once the key has been installed on the remote computer, you should be able to initiate a connection without being asked to enter your password. Enter the following command to test the connection: `$ ssh <username>@<remote>`
If you connect without being prompted for the password, then the keys are configured correctly.
