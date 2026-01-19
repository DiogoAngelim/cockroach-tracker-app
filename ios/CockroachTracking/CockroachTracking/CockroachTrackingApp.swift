//
//  CockroachTrackingApp.swift
//  CockroachTracking
//
//  Created by Diogo de Aquino Angelim on 19/01/26.
//

import SwiftUI
import CoreData

@main
struct CockroachTrackingApp: App {
    let persistenceController = PersistenceController.shared

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(\.managedObjectContext, persistenceController.container.viewContext)
        }
    }
}
