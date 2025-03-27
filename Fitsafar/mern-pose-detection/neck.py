# import cv2
# import mediapipe as mp
# import numpy as np

# def detect_neck_exercise():
#     mp_face_mesh = mp.solutions.face_mesh
#     face_mesh = mp_face_mesh.FaceMesh(static_image_mode=False, max_num_faces=1, min_detection_confidence=0.5)
    
#     cap = cv2.VideoCapture(0)  # Open webcam
    
#     prev_direction = "Neutral"
#     left_count = 0
#     right_count = 0
#     correct_posture = True
    
#     while cap.isOpened():
#         ret, frame = cap.read()
#         if not ret:
#             break
        
#         frame = cv2.flip(frame, 1)  # Mirror the frame
#         rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
#         results = face_mesh.process(rgb_frame)
        
#         frame_height, frame_width, _ = frame.shape
        
#         if results.multi_face_landmarks:
#             for face_landmarks in results.multi_face_landmarks:
#                 nose_tip = face_landmarks.landmark[1]  # Nose tip (Index 1)
#                 chin = face_landmarks.landmark[152]  # Chin (Index 152)
                
#                 nose_x, nose_y = int(nose_tip.x * frame_width), int(nose_tip.y * frame_height)
#                 chin_x, chin_y = int(chin.x * frame_width), int(chin.y * frame_height)
                
#                 neck_length = abs(chin_y - nose_y)
                
#                 # Determine head movement direction
#                 if chin_x < frame_width // 2 - 80:
#                     direction = "Left"
#                 elif chin_x > frame_width // 2 + 80:
#                     direction = "Right"
#                 else:
#                     direction = "Neutral"
                
#                 # Count side-to-side movements
#                 if direction == "Left" and prev_direction != "Left":
#                     left_count += 1
#                 elif direction == "Right" and prev_direction != "Right":
#                     right_count += 1
#                 prev_direction = direction
                
#                 # Check if posture is correct
#                 if neck_length < 60 or neck_length > 110:  # Adjust thresholds as needed
#                     correct_posture = False
#                     feedback = "Incorrect Posture! Keep your neck aligned."
#                     color = (0, 0, 255)  # Red for incorrect posture
#                 else:
#                     correct_posture = True
#                     feedback = "Good Posture!"
#                     color = (0, 255, 0)  # Green for correct posture
                
#                 # Draw landmarks and lines
#                 cv2.circle(frame, (nose_x, nose_y), 5, (0, 255, 0), -1)
#                 cv2.circle(frame, (chin_x, chin_y), 5, (0, 0, 255), -1)
#                 cv2.line(frame, (nose_x, nose_y), (chin_x, chin_y), (255, 255, 0), 2)
                
#                 # Display text
#                 cv2.putText(frame, f"Neck Movement: {direction}", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2)
#                 cv2.putText(frame, f"Left: {left_count} | Right: {right_count}", (50, 100), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
#                 cv2.putText(frame, feedback, (50, 150), cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 2)
                
#         cv2.imshow("Neck Exercise Counter", frame)
        
#         if cv2.waitKey(1) & 0xFF == ord('q'):
#             break
    
#     cap.release()
#     cv2.destroyAllWindows()

# if __name__ == "__main__":
#     detect_neck_exercise()
