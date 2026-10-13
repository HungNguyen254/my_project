
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBiCdoub6b-LDOa3zonQ9tQ2GwRRAP2dVU",
    authDomain: "homework-19668.firebaseapp.com",
    projectId: "homework-19668",
    storageBucket: "homework-19668.firebasestorage.app",
    messagingSenderId: "797958590613",
    appId: "1:797958590613:web:28013d5e85a4c49e498b9c",
    measurementId: "G-0DEFC9ZRX4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const NameInput = document.querySelector(".name_input");
const LinkInput = document.querySelector(".link_input");
const buttonCreate = document.querySelector(".button_create");
const Linklist = document.querySelector(".link_list");

// Lấy collection chứa các link
const linksCollection = collection(db, "links");

// Hiển thị thông báo
function showToast(message, color) {
    Toastify({
        text: message,
        duration: 3000,
        gravity: "top",
        position: "right",
        close: true,
        style: {
            background: color,
            borderRadius: "8px"
        }
    }).showToast();
}

// Nhấn nút để lưu link lên Firebase
buttonCreate.addEventListener("click", async function () {
    const name = NameInput.value.trim();
    const link = LinkInput.value.trim();

    if (name === "" || link === "") {
        showToast("Tên hoặc link không được để trống", "rgb(194, 31, 31)");
        return;
    }

    // Kiểm tra link có đúng định dạng URL không
    let validUrl;

    try {
        validUrl = new URL(link);
    } catch {
        showToast("Đường link không hợp lệ", "rgb(194, 31, 31)");
        return;
    }

    if (validUrl.protocol !== "http:" && validUrl.protocol !== "https:") {
        showToast("Link phải bắt đầu bằng http:// hoặc https://", "rgb(194, 31, 31)");
        return;
    }

    try {
        // Lưu dữ liệu lên Firestore
        await addDoc(linksCollection, {
            name: name,
            link: validUrl.href,
            createdAt: new Date()
        });

        showToast("Lưu link thành công!", "rgb(30, 140, 70)");

        NameInput.value = "";
        LinkInput.value = "";
    } catch (error) {
        console.error("Lỗi khi lưu link:", error);
        showToast("Không lưu được link. Hãy kiểm tra quyền Firestore.", "rgb(194, 31, 31)");
    }
});

// Theo dõi dữ liệu Firestore và tự cập nhật giao diện
onSnapshot(linksCollection, function (snapshot) {
    Linklist.replaceChildren();

    snapshot.forEach(function (doc) {
        const data = doc.data();

        const LinkForm = document.createElement("div");
        LinkForm.className = "link_form";

        const NamePerson = document.createElement("div");
        NamePerson.className = "name_person";
        NamePerson.textContent = data.name;

        const LinkDoc = document.createElement("div");
        LinkDoc.className = "link_drive";

        const linkElement = document.createElement("a");
        linkElement.href = data.link;
        linkElement.textContent = data.link;
        linkElement.target = "_blank";
        linkElement.rel = "noopener noreferrer";

        LinkDoc.appendChild(linkElement);
        LinkForm.appendChild(NamePerson);
        LinkForm.appendChild(LinkDoc);
        Linklist.appendChild(LinkForm);
    });
}, function (error) {
    console.error("Lỗi khi đọc Firestore:", error);
    showToast("Không đọc được dữ liệu. Hãy kiểm tra quyền Firestore.", "rgb(194, 31, 31)");
});