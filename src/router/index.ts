import { createRouter, createWebHistory } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ProjectsPage from "../views/Projects/ProjectsPage.vue";
import CreateProject from "../views/Projects/CreateProject.vue";
import CreateVacancy from "../views/Projects/CreateVacancy.vue";
import EditProjectPage from "../views/Projects/EditProjectPage.vue";
import HomePage from "../views/Projects/HomePage.vue";
import LoginPage from "../views/Projects/LoginPage.vue";

const routes = [

  {
    path: "/",
    name: "Home",
    component: HomePage,
    meta: { requiresAuth: true },
  },
  {
    path: "/projects",
    name: "Projects",
    component: ProjectsPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/projects/:id",
    name: "EditProjectPage",
    component: EditProjectPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/create-project",
    name: "CreateProjects",
    component: CreateProject,
    meta: { requiresAuth: true },
  },
  {
    path: "/projects/:projectId/create-vacancy",
    name: "CreateVacancy",
    component: CreateVacancy,
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "LoginPage",
    component: LoginPage,
    meta: { requiresAuth: false },
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

function getCurrentUser(): Promise<any> {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener();
        resolve(user);
      },
      reject
    );
  });
}

router.beforeEach(async (to, _, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const user = await getCurrentUser();

  if (requiresAuth && !user) {
    next("/login");
  } else if (to.path === "/login" && user) {
    // ⛔️ Пользователь авторизован — не пускаем на логин
    next("/");
  } else {
    next();
  }
});


export default router;
