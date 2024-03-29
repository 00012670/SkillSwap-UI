import { Component } from '@angular/core';
import { GetSwapRequest, Status, UpdateSwapRequest } from 'src/app/models/request.model';
import { RequestService } from 'src/app/services/request.service';
import { AuthService } from 'src/app/services/auth.service';
import { NgToastService } from 'ng-angular-popup';


@Component({
  selector: 'app-manage-requests',
  templateUrl: './manage-requests.component.html',
  styleUrls: ['./manage-requests.component.scss']
})
export class ManageRequestsComponent {



  receivedSwapRequests: GetSwapRequest[] = [];
  sentSwapRequests: GetSwapRequest[] = [];
  Status = Status;
  skill: any;


  constructor(
    private requestService: RequestService,
    private authService: AuthService,
    private toast: NgToastService,

  ) { }

  ngOnInit() {
    const userId = this.authService.getUserId();
    this.requestService.getSwapRequests(userId).subscribe(
      (requests) => {
        this.receivedSwapRequests = requests;
      },
      (error) => {
        console.error('Failed to get swap requests', error);
      }
    );

    this.requestService.getSentSwapRequests(userId).subscribe(
      (requests) => {
        this.sentSwapRequests = requests;
      },
      (error) => {
        console.error('Failed to get sent swap requests', error);
      }
    );
  }


  acceptRequest(request: GetSwapRequest) {
    const updatedRequest: UpdateSwapRequest = { statusRequest: Status.Accepted };
    this.requestService.updateSwapRequest(request.requestId, updatedRequest).subscribe(
      () => {
        this.toast.success({ detail: "SUCCESS", summary: "Request accepted", duration: 3000 });
        console.log('Request accepted');
        const index = this.receivedSwapRequests.findIndex(r => r.requestId === request.requestId);
        if (index !== -1) {
          this.receivedSwapRequests[index].statusRequest = Status.Accepted;
        }
      },
      (error) => {
        console.error('Failed to accept request', error);
      }
    );
  }

  rejectRequest(request: GetSwapRequest) {
    const updatedRequest: UpdateSwapRequest = { statusRequest: Status.Rejected };
    this.requestService.updateSwapRequest(request.requestId, updatedRequest).subscribe(
      () => {
        this.toast.success({ detail: "SUCCESS", summary: "Request rejected", duration: 3000 });
        console.log('Request rejected');
        const index = this.receivedSwapRequests.findIndex(r => r.requestId === request.requestId);
        if (index !== -1) {
          this.receivedSwapRequests[index].statusRequest = Status.Rejected;
        }
      },
      (error) => {
        console.error('Failed to reject request', error);
      }
    );
  }

  deleteRequest(request: GetSwapRequest) {
    this.requestService.deleteSwapRequest(request.requestId).subscribe(
      () => {
        this.toast.success({ detail: "SUCCESS", summary: "Request deleted", duration: 3000 });
        console.log('Request deleted');
        this.receivedSwapRequests = this.receivedSwapRequests.filter(r => r.requestId !== request.requestId);
        this.sentSwapRequests = this.sentSwapRequests.filter(r => r.requestId !== request.requestId);
      },
      (error) => {
        console.error('Failed to delete request', error);
      }
    );
  }

  getStatus(status: Status): string {
    switch (status) {
      case Status.Pending:
        return 'Pending';
      case Status.Accepted:
        return 'Accepted';
      case Status.Rejected:
        return 'Rejected';
      case Status.Invalid:
        return 'Invalid';
      default:
        return '';
    }
  }
}
