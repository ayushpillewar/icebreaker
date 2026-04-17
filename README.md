# icebreaker


## Running the app
To switch to real BLE hardware: edit ServiceContainer.ts, uncomment the BLE block, and set useMock={false} in app/_layout.tsx.


src/
├── models/          User · Peer · Message          (plain data)
├── interfaces/      IScanner · IAdvertiser · IConnector
│                    IMessageSender · IMessageReceiver
│                    IUserRepository · IPermissionService
├── services/
│   ├── mock/        MockScanner · MockAdvertiser · MockConnector · MockMessaging
│   └── ble/         BleScanner · BleAdvertiser · BleConnector · BleMessaging
│                    (real react-native-ble-plx implementation)
│   AsyncStorageUserRepository · NativePermissionService
├── container/       ServiceContainer · ServiceProvider  (DI root)
├── store/           userStore · peerStore · chatStore   (Zustand)
├── hooks/           useUserProfile · useDiscovery · useChat · usePermissions
└── components/      PeerCard · ChatBubble · MessageInput
                     VisibilityToggle · UserSetup · EmptyState

app/
├── _layout.tsx          → wraps tree in <ServiceProvider>
├── (tabs)/
│   ├── index.tsx        → Home tab (name + visibility toggle)
│   └── explore.tsx      → Nearby tab (BLE scan list)
└── chat/[peerId].tsx    → Chat screen (per-peer)


## use this command to build locally 
- npx expo prebuild --platform ios --clean
- cd ios && pod install && cd ..
- npx expo run:ios
- npx expo run:ios --configuration Debug
- npx expo run:ios --configuration Release //for running wihout metro server on local
- npx expo run:ios --device // for runnihn