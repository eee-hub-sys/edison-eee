import {
    collection,
    getDocs,
    addDoc,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from "./firebase-init.js";

// Fetch all clubs
export const getClubs = async () => {
    const querySnapshot = await getDocs(collection(db, "clubs"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Fetch all events
export const getEvents = async () => {
    const q = query(collection(db, "events"), orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Fetch gallery images
export const getGallery = async () => {
    const querySnapshot = await getDocs(collection(db, "gallery"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Submit registration
export const submitRegistration = async (registrationData) => {
    try {
        const docRef = await addDoc(collection(db, "registrations"), {
            ...registrationData,
            createdAt: serverTimestamp()
        });
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("Error adding document: ", error);
        return { success: false, error };
    }
};

// Function to seed initial data (only run once)
export const seedInitialData = async (initialClubs, initialEvents, initialGallery) => {
    const clubsCol = collection(db, "clubs");
    const eventsCol = collection(db, "events");
    const galleryCol = collection(db, "gallery");

    // Check if already seeded to avoid duplicates
    const existingClubs = await getDocs(clubsCol);
    if (existingClubs.empty) {
        console.log("Seeding clubs...");
        for (const club of initialClubs) {
            await addDoc(clubsCol, club);
        }

        console.log("Seeding events...");
        for (const event of initialEvents) {
            await addDoc(eventsCol, event);
        }

        console.log("Seeding gallery...");
        for (const image of initialGallery) {
            await addDoc(galleryCol, image);
        }
        console.log("Seeding complete!");
    } else {
        console.log("Database already contains data, skipping seed.");
    }
};
