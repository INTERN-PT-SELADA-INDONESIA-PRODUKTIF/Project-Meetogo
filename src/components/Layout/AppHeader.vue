<template>
    <nav class="navbar navbar-expand-lg navbar-primary bg-primary">
      <div class="container-fluid">
        <router-link :to="{ name : 'home' }" class="navbar-brand d-flex align-items-center">
          <strong>MeetToGo</strong>
        </router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ml-auto">
            <li nav-item me-3>
              <router-link :to="{ name : 'home' }" class="nav-link" :class="$route.name == 'home'? 'activate':''" aria-current="page">
                Home
              </router-link>
            </li>
            <li nav-item me-3>
              <router-link :to="{ name : 'about' }" class="nav-link" :class="$route.name == 'about'? 'activate':''" aria-current="page">
                About
              </router-link>
            </li>
            <li nav-item me-3>
              <router-link :to="{ name : '' }" class="nav-link" :class="$route.name == ''? 'activate':''" aria-current="page">
                Collaborator
              </router-link>
            </li>
            <li nav-item me-3>
              <router-link :to="{ name : '' }" class="nav-link" :class="$route.name == ''? 'activate':''" aria-current="page">
                Profile
              </router-link>
            </li>
            <li nav-item me-3>
              <router-link :to="{ name : 'login' }" class="nav-link" :class="$route.name == ''? 'activate':''" aria-current="page">
                Logout
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
</template>

<style>
.nav-link:hover,
.nav-link.activate {
  color: white;
}
</style>
