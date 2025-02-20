import { Client, Account, ID, Models, Avatars, Databases } from 'react-native-appwrite';

export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.gazoinc.aora',
    projectId: '67b4d07200150e8db057',
    databaseId: '67b4d20f001dd4816b8b',
    userCollectionId: '67b4d23b0007160d42df',
    videoCollectionId: '67b4d261000de604fc04',
    storageId: '67b4dc1e000aecbf0ba9',

}

// Initialize the Appwrite SDK
let client = new Client();

client
  .setEndpoint(config.endpoint) // Your API Endpoint
  .setProject(config.projectId)   // Your Project ID
  .setPlatform(config.platform);   // Your package name / bundle identifier

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (email, password, username) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )

        if(!newAccount) {
            throw new Error('Account not created')
        }

        const avatarUrl = avatars.getInitials(username)

        await signIn(email, password);

        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl
            }
        )

        return newUser;
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
}

export const signIn = async (email, password) => {
    try {
        const session = await account.createEmailPasswordSession(email, password)
    } catch (error) {
        throw new Error(error)      
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();
        
        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if(!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        
    }
}