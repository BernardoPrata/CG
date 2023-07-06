# Transformer #

## Interactive Scene with Fixed Cameras, Geometric Primitive Instantiation, Simple Animations, and Collisions

This project is a computer graphics assignment that involves creating an interactive scene with fixed cameras, geometric primitive instantiation, simple animations, and collision detection. The objective is to understand and implement the architecture of an interactive graphics application, explore basic concepts of geometric modeling through primitive instantiation, work with virtual cameras, understand the differences between orthogonal and perspective projections, apply basic animation techniques, and implement simple collision detection techniques.

## Instructions

Run the project and then follow these instructions to be able to interact with the scene:

1. Press the numeric keys '1' to '5' to switch between different fixed cameras:
   - '1': Frontal view
   - '2': Lateral view
   - '3': Top view
   - '4': Isometric view with orthogonal projection
   - '5': Isometric view with perspective projection
   - '6': Toggle between wireframe and solid visualization of the scene objects


2. To convert between the robot and truck modes, use the following keys to control the degrees of freedom:
   - 'Q(q)' and 'A(a)': Rotate the θ1 angle, which rotates the foot revolution axis.
   - 'W(w)' and 'S(s)': Rotate the θ2 angle, which rotates the waist revolution axis.
   - 'E(e)' and 'D(d)': Translate the upper limbs medially and laterally by controlling the δ1 displacement.
   - 'R(r)' and 'F(f)': Rotate the θ3 angle, which rotates the head revolution axis.
   

3. To move the trailer along the X and Z axes, use the arrow keys. The robot remains in a fixed position, and pressing the arrow keys will reposition the trailer accordingly.

   - Press the up arrow key to move the trailer backward along the Z axis.
   - Press the down arrow key to move the trailer forward along the Z axis.
   - Press the left arrow key to move the trailer to the left along the X axis.
   - Press the right arrow key to move the trailer to the right along the X axis.

4. Collision detection between the truck and the trailer has been implemented using Axis-Aligned Bounding Boxes (AABB). **This collision detection is specifically triggered when the truck is transformed into a robot by using the designated keys mentioned in step 3.**  Whenever a collision is detected, an animation is triggered, which moves the trailer towards the connection point with the truck.

## Course Information

Course: Computação Gráfica (Computer Graphics)
Period: 2022/2023 - 4th Period
Programs: LEIC-A
Students:
    **99184 Bernardo Prata**
    99951 Guilherme Leitão 
    99284 Matilde Nunes Heitor

