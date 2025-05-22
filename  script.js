// عرض الساعة في أسفل يمين الصفحة
function showClock() {
  const clock = document.getElementById('clock');
  setInterval(() => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('ar-EG', { hour12: false });
    clock.textContent = timeStr;
  }, 1000);
}

// جلب المستخدم المسجل من localStorage وعرض اسمه
function showLoggedUser() {
  const userData = localStorage.getItem('loggedUser');
  if(!userData) {
    // إذا ما في تسجيل دخول، اذهب لتسجيل الدخول
    window.location.href = 'login.html';
    return null;
  }
  const user = JSON.parse(userData);
  const welcomeDiv = document.getElementById('welcomeUser');
  welcomeDiv.textContent = `مرحباً، ${user.username} (${user.role})`;
  return user;
}

// تحميل العملاء من localStorage أو تهيئة مصفوفة فارغة
function loadClients() {
  const data = localStorage.getItem('clients');
  return data ? JSON.parse(data) : [];
}

// حفظ العملاء في localStorage
function saveClients(clients) {
  localStorage.setItem('clients', JSON.stringify(clients));
}

// فتح المودال
function openModal(modal) {
  modal.style.display = 'flex';
}

// إغلاق المودال
function closeModal(modal) {
  modal.style.display = 'none';
}

// تحديث جدول العملاء
function updateClientsTable() {
  const clients = loadClients();
  const tbody = document.getElementById('clientsTableBody');
  tbody.innerHTML = '';

  clients.forEach((client, index) => {
    const tr = document.createElement('tr');

    const tdName = document.createElement('td');
    tdName.textContent = client.name;
    tdName.classList.add('client-name');
    tdName.addEventListener('click', () => openEditClientModal(index));
    tr.appendChild(tdName);

    const tdNationalId = document.createElement('td');
    tdNationalId.textContent = client.nationalId;
    tr.appendChild(tdNationalId);

    const tdActions = document.createElement('td');

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'حذف';
    deleteBtn.style.backgroundColor = '#c0392b';
    deleteBtn.style.marginRight = '10px';
    deleteBtn.onclick = () => {
      if(confirm('هل أنت متأكد من حذف هذا العميل؟')) {
        deleteClient(index);
      }
    };

    tdActions.appendChild(deleteBtn);
    tr.appendChild(tdActions);

    tbody.appendChild(tr);
  });
}

// حذف عميل
function deleteClient(index) {
  const clients = loadClients();
  clients.splice(index, 1);
  saveClients(clients);
  updateClientsTable();
}

// مودال إضافة / تعديل عميل
const clientModal = document.getElementById('clientModal');
const modalTitle = document.getElementById('modalTitle');
const modalClientName = document.getElementById('modalClientName');
const modalNationalId = document.getElementById('modalNationalId');
const saveClientBtn = document.getElementById('saveClientBtn');

let editingIndex = -1;

function openAddClientModal() {
  editingIndex = -1;
  modalTitle.textContent = 'إضافة عميل جديد';
  modalClientName.value = '';
  modalNationalId.value = '';
  openModal(clientModal);
}

function openEditClientModal(index) {
  const clients = loadClients();
  const client = clients[index];
  editingIndex = index;
  modalTitle.textContent = 'تعديل بيانات العميل';
  modalClientName.value = client.name;
  modalNationalId.value = client.nationalId;
  openModal(clientModal);
}

saveClientBtn.onclick = () => {
  const name = modalClientName.value.trim();
  const nationalId = modalNationalId.value.trim();

  if(name === '' || nationalId === '') {
    alert('الرجاء تعبئة جميع الحقول');
    return;
  }

  const clients = loadClients();

  if(editingIndex === -1) {
    // إضافة جديد
    clients.push({ name, nationalId });
  } else {
    // تعديل
    clients[editingIndex].name = name;
    clients[editingIndex].nationalId = nationalId;
  }

  saveClients(clients);
  updateClientsTable();
  closeModal(clientModal);
};

// مودال قائمة العملاء
const clientsListModal = document.getElementById('clientsListModal');
const closeClientsListModal = document.getElementById('closeClientsListModal');
const clientsTableBody = document.getElementById('clientsTableBody');

document.getElementById('showClientsBtn').onclick = () => openModal(clientsListModal);
document.getElementById('closeClientsListModal').onclick = () => closeModal(clientsListModal);

// زر فتح مودال إضافة العميل
document.getElementById('addClientBtn').onclick = openAddClientModal;

// إغلاق مودال إضافة/تعديل العميل
document.getElementById('closeClientModal').onclick = () => closeModal(clientModal);

// عند تحميل الصفحة
window.onload = () => {
  showClock();
  showLoggedUser();
  updateClientsTable();
};