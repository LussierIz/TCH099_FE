self.addEventListener("push", (event) => {
    const notification = event.data.json();
    // {"title": "Hello", "body": "World", "url": "/html/objectifs.html"}
    event.waitUntil(
        self.registration.showNotification(notification.title, {
            body: notification.body,
            icon: "images/star-logo-tr.png",
            data: {
                notifURL: notification.url
            }
        })
    );
});

self.addEventListener("notificationclick", (event) => {
    event.waitUntil(clients.openWindow(event.notification.data.notifURL));
});