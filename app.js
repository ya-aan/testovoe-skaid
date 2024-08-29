document.addEventListener('DOMContentLoaded', function () {
  let users = [];

  const userList = document.getElementById('user-list');
  const ageFilter = document.getElementById('age-filter');
  const sortOption = document.getElementById('sort-option');
  const addUserBtn = document.getElementById('add-user-btn');

  function renderUsers(users) {
      userList.innerHTML = '';

      users.forEach(user => {
          const userItem = document.createElement('li');
          userItem.className = 'user-item';

          const userPhoto = document.createElement('img');
          userPhoto.src = user.photo || 'https://via.placeholder.com/50';
          userPhoto.alt = `${user.firstName} ${user.lastName}`;

          const userInfo = document.createElement('div');
          userInfo.innerHTML = `
              <strong>${user.firstName} ${user.lastName}</strong><br>
              Возраст: ${user.age}<br>
              Email: ${user.email}
          `;

          userItem.appendChild(userPhoto);
          userItem.appendChild(userInfo);

          userList.appendChild(userItem);
      });
  }

  function sortUsers(users) {
      const sortBy = sortOption.value;
      return users.slice().sort((a, b) => {
          if (sortBy === 'name') {
              return a.firstName.localeCompare(b.firstName);
          } else if (sortBy === 'age') {
              return a.age - b.age;
          }
      });
  }

  function filterUsers() {
      const isChecked = ageFilter.checked;
      let filteredUsers = isChecked ? users.filter(user => user.age > 18) : users;
      const sortedUsers = sortUsers(filteredUsers);
      renderUsers(sortedUsers);
  }

  function clearFields() {
      document.getElementById('first-name').value = '';
      document.getElementById('last-name').value = '';
      document.getElementById('age').value = '';
      document.getElementById('email').value = '';
      document.getElementById('photo').value = '';
  }

  addUserBtn.addEventListener('click', function () {
      const firstName = document.getElementById('first-name').value.trim();
      const lastName = document.getElementById('last-name').value.trim();
      const age = parseInt(document.getElementById('age').value.trim(), 10);
      const email = document.getElementById('email').value.trim();
      const photoInput = document.getElementById('photo');
      let photo = '';

      if (!firstName || !lastName || isNaN(age) || !email) {
          alert('Заполните поля');
          return;
      }

      if (photoInput.files && photoInput.files[0]) {
          const reader = new FileReader();
          reader.onload = function (e) {
              photo = e.target.result;
              users.push({ firstName, lastName, age, email, photo });
              filterUsers();
              clearFields();
          };
          reader.readAsDataURL(photoInput.files[0]);
      } else {
          users.push({ firstName, lastName, age, email, photo });
          filterUsers();
          clearFields();
      }
  });

  function loadUsers() {
      fetch('users.json')
          .then(response => response.json())
          .then(data => {
              users = data.map(user => ({
                  ...user,
                  age: parseInt(user.age, 10)
              }));
              filterUsers();
          })
          .catch(error => {
              console.error('Ошибка загрузки данных:', error);
          });
  }

  ageFilter.addEventListener('change', filterUsers);
  sortOption.addEventListener('change', filterUsers);

  loadUsers();
});

