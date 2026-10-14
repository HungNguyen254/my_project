import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    onSnapshot,
    doc,
    updateDoc,
    deleteDoc
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

// Trạng thái: null = đang thêm mới, có id = đang sửa link đó
let editingId = null;

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
        if (editingId === null) {
            await addDoc(linksCollection, {
                name: name,
                link: validUrl.href,
                createdAt: new Date()
            });

            showToast("Lưu link thành công!", "rgb(30, 140, 70)");
        } else {
            await updateDoc(doc(db, "links", editingId), {
                name: name,
                link: validUrl.href
            });

            showToast("Cập nhật link thành công!", "rgb(30, 140, 70)");
            editingId = null;
            buttonCreate.textContent = "Lưu link";
        }

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

    if (snapshot.empty) {
        const empty = document.createElement("div");
        empty.className = "empty_state";
        empty.textContent = "Chưa có link nào. Nhập tên và link ở trên rồi bấm Lưu link.";
        Linklist.appendChild(empty);
        return;
    }

    snapshot.forEach(function (docSnapshot) {
        const data = docSnapshot.data();

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

        const buttonEdit = document.createElement("button");
        buttonEdit.textContent = "Sửa";
        buttonEdit.className = "button_edit";
        
const buttonDelete = document.createElement("button");
buttonDelete.textContent = "Xóa";
buttonDelete.className = "button_delete";

buttonDelete.addEventListener("click", async function () {
    const confirmDelete = confirm("Bạn có chắc chắn muốn xóa link này không?");

    if (!confirmDelete) {
        return;
    }

    try {
        await deleteDoc(doc(db, "links", docSnapshot.id));
        showToast("Xóa link thành công!", "rgb(30, 140, 70)");
    } catch (error) {
        console.error("Lỗi khi xóa link:", error);
        showToast("Không thể xóa link!", "rgb(194, 31, 31)");
    }
});


        buttonEdit.addEventListener("click", function () {
            NameInput.value = data.name;
            LinkInput.value = data.link;

            editingId = docSnapshot.id;
            buttonCreate.textContent = "Cập nhật";

            NameInput.focus();
        });

        LinkDoc.appendChild(linkElement);
        LinkForm.appendChild(NamePerson);
        LinkForm.appendChild(LinkDoc);
        LinkForm.appendChild(buttonEdit);
        LinkForm.appendChild(buttonDelete);
        Linklist.appendChild(LinkForm);
    });
}, function (error) {
    console.error("Lỗi khi đọc Firestore:", error);
    showToast("Không đọc được dữ liệu. Hãy kiểm tra quyền Firestore.", "rgb(194, 31, 31)");
});