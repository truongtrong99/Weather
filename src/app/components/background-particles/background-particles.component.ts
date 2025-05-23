import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Particle {
  id: number;
  size: number;
  speed: number;
  opacity: number;
  type: 'star' | 'circle' | 'square';
}

/**
 * Component for animated background particles
 */
@Component({
  selector: 'app-background-particles',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="particles-container">
      <div class="shooting-star" *ngFor="let star of shootingStars"></div>
      <div
        class="particle"
        *ngFor="let particle of particles"
        [ngClass]="particle.type"
        [style.--particle-size.px]="particle.size"
        [style.--particle-speed]="particle.speed + 's'"
        [style.--particle-opacity]="particle.opacity"
      ></div>
    </div>
  `,
  styleUrls: ['./background-particles.component.scss']
})
export class BackgroundParticlesComponent implements OnInit {
  // Generate particles with random properties
  particles: Particle[] = [];
  shootingStars: any[] = Array(8).fill(0).map((_, i) => ({ id: i }));

  ngOnInit(): void {
    this.generateParticles(50);
  }

  /**
   * Generate particles with random properties
   */
  private generateParticles(count: number): void {
    const types: ('star' | 'circle' | 'square')[] = ['star', 'circle', 'square'];

    for (let i = 0; i < count; i++) {
      this.particles.push({
        id: i,
        size: this.randomRange(3, 18),
        speed: this.randomRange(10, 30),
        opacity: this.randomRange(0.1, 0.9),
        type: types[Math.floor(Math.random() * types.length)]
      });
    }
  }

  /**
   * Generate a random number within a range
   */
  private randomRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }
}
