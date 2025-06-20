import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { interval, map } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent {

  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    // Create an interval observable that emits a value every second (app might need to send http requests or perform other tasks periodically)
    const subscription = interval(1000).pipe(
      map(value => value *2) // RxJS operator map function to transform the emitted value
    ).subscribe({
      next: (value) => {
        console.log('Interval value:', value);
      },
      // error: (err) => {
      //   console.error('Error occurred:', err);
      // },
      // complete: () => {
      //   console.log('Interval completed');
      // }
    });

    this .destroyRef.onDestroy(() => {
      subscription.unsubscribe(); // Unsubscribe when the component is destroyed (important for memory management)
    }
    );
  }

  private clickCount = signal(0); // Create a signal to hold the click count

  private $clickCount = toObservable(this.clickCount); // Convert the signal to an observable

  constructor() {
    // Subscribe to the observable to react to changes in the click count
    this.$clickCount.subscribe({
      next: (value) => {
        console.log('OBSERVABLE: Click count:', value); // Log the updated click count
      }
    });

    // Effect to react to changes in the click count signal value
    effect(() => {
      console.log('EFFECT: Click count:', this.clickCount()); // Log the click count whenever it changes
    })

  }

  onClick() {
    this.clickCount.update(value => value + 1); // Increment the click count
  }


}
