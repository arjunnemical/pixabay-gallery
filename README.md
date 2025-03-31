# pixabay-gallery-demo

### Updated .env file with Pixabay API Key
```
VUE_APP_PIXABAY_API_KEY
```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


## 🏗️ **Project Structure**
```
src
├── components            # Reusable Vue components
│   ├── gallery           # Contains components related to gallery
│       └── header        # Contains header with search bar
│       └── sidebar       # Contains sidebar filter
│   ├── widgets           # Contains reusable components like buttons, loaders
├── models                # Typescript interfaces
├── views
│   ├── HomeView.vue      # Main gallery view
├── store                 # Vuex store (state management)
├── router                # Vue Router setup
├── App.vue               # Root component
└── main.ts               # Entry point
```

### Docker Commands
```
docker build -t pixabay-gallery-demo .
docker run -it -p 8080:8080 --rm --name pixabay-gallery
```

### Vercel Deployment
```
vercel login

vercel init

vercel --prod
```

### Demo Link
[https://pixabay.masterarjun.com/](https://pixabay.masterarjun.com/)
